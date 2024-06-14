
const { getViewDefinitions } = require('../viewDefinitions')

module.exports = class Views1709641962433 {
  name = 'Views1709641962433'

  async up(db) {
    const viewDefinitions = getViewDefinitions(db);
    for (const [tableName, viewConditions] of Object.entries(viewDefinitions)) {
      if (Array.isArray(viewConditions)) {
        await db.query(`
          CREATE OR REPLACE VIEW "${tableName}" AS
            SELECT *
            FROM "admin"."${tableName}" AS "this"
            WHERE ${viewConditions.map(cond => `(${cond})`).join(' AND ')}
        `);
      } else {
        await db.query(`
          CREATE OR REPLACE VIEW "${tableName}" AS (${viewConditions})
        `);
      }
    }

    const ammVolumeCte = `
WITH  trading_volumes AS (
   SELECT ac.token_id,
        SUM(tr.price_paid) as amm_volume
   FROM amm_transaction tr
   JOIN amm_curve ac ON ac.id = tr.amm_id
   GROUP BY token_id
),
`

    const priceChangeCtes = `
 last_day_transactions AS (
    SELECT
        tr.amm_id,
        ac.token_id,
        ROUND(tr.price_paid / tr.quantity) AS price_paid,
        tr.created_in
    FROM amm_transaction tr
    JOIN amm_curve ac ON tr.amm_id = ac.id
    WHERE tr.created_in >= (SELECT height FROM squid_processor.status) - ${BLOCKS_PER_DAY} 
),
ldt_oldest_transactions AS (
    SELECT
        ldt.token_id,
        ldt.price_paid AS oldest_price_paid
    FROM last_day_transactions ldt
    JOIN (
        SELECT token_id, MIN(created_in) AS oldest_created_in
        FROM last_day_transactions
        GROUP BY token_id
    ) oldest ON ldt.token_id = oldest.token_id AND ldt.created_in = oldest.oldest_created_in
)   
`
      const currentAmmVolumeWithoutCurrentWeek = `
    SELECT 
        amm_id,
        SUM(CASE
                WHEN transaction_type = 'BUY' THEN quantity
                ELSE 0
            END
        ) AS buy_until,
        SUM(CASE
                WHEN transaction_type = 'SELL' THEN quantity
                ELSE 0
            END
        ) AS sell_until
    FROM amm_transaction
    WHERE created_in <= (SELECT height FROM squid_processor.status) - ${7 * BLOCKS_PER_DAY} 
    GROUP BY amm_id
`

    const marketplaceTokensViewQuery = `
${ammVolumeCte}
${priceChangeCtes}
SELECT
    (ac.minted_by_amm - ac.burned_by_amm) as liquidity,
    (ct.last_price * ct.total_supply) as market_cap,
    c.cumulative_revenue,
    tv.amm_volume,
    CASE 
            WHEN ldt_o.oldest_price_paid = 0 THEN 0
            ELSE ((ct.last_price - ldt_o.oldest_price_paid) * 100.0 / ldt_o.oldest_price_paid)
    END AS last_day_price_change,
    ((ac.minted_by_amm - ac.burned_by_amm - (liq_until.buy_until - liq_until.sell_until)) * 100 / (liq_until.buy_until - liq_until.sell_until)) as weekly_liq_change,
    ct.*
FROM creator_token ct
LEFT JOIN token_channel tc ON tc.token_id = ct.id
LEFT JOIN channel c ON c.id = tc.channel_id
LEFT JOIN ldt_oldest_transactions ldt_o ON ldt_o.token_id = ct.id
LEFT JOIN amm_curve ac ON ac.id = ct.current_amm_sale_id
JOIN (
    ${currentAmmVolumeWithoutCurrentWeek}
) as liq_until ON liq_until.amm_id = ac.id
LEFT JOIN trading_volumes tv ON tv.token_id = ct.id
`
      const marketplaceTokenMaterializedViewName = 'marketplace_tokens'
      await db.query(`
CREATE MATERIALIZED VIEW ${marketplaceTokenMaterializedViewName}  as (
${marketplaceTokensViewQuery}
) WITH DATA;
`)
  }  

  async down(db) {
    const viewDefinitions = this.getViewDefinitions(db)
    for (const viewName of Object.keys(viewDefinitions)) {
      await db.query(`DROP VIEW "${viewName}"`)
    }
    await db.query(`DROP MATERIALIZED VIEW IF EXISTS ${marketplaceTokenMaterializedViewName};`)

  }
}
