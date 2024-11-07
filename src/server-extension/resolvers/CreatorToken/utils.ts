import { BLOCKS_PER_DAY } from '.'

type WithPriceChangeParams = {
  periodDays: number
  currentBlock: number | string
  minVolume?: string | null
}
/**
 * Provides a list of `WITH` statements for a query that needs to access
 * CRT price change in the last {periodDays} days
 *
 * Definitions:
 * current_tx - latest tx made DURING the provided period in the currently active amm sale
 * starting_tx - latest tx made BEFORE the start of the provided period in the currently active amm sale
 * fallback_tx - oldest tx made in the currently active amm sale
 * price_change = 100 * (current_tx ? (current_tx - starting_tx || fallback_tx) / (starting_tx || fallback_tx) : 0)
 *
 * @param periodDays    How many days in the past the period of interest begins
 * @param currentBlock  Blocknumber to treat as current block.
 *                      If string, it is treated as JOIN table with `height` column.
 * @param minVolume     If provided - ignore tokens with volume lower than {minVolume} in the period of interest.
 *
 * @returns List of WITH statements to add to a query
 */
export const withPriceChange = ({ periodDays, currentBlock, minVolume }: WithPriceChangeParams) => {
  const currentBlockJoinStmt =
    typeof currentBlock === 'string' ? `JOIN ${currentBlock} AS current_block ON 1=1` : ''
  if (currentBlockJoinStmt) {
    currentBlock = 'current_block.height'
  }
  return `
toknes_with_current_tx AS (
    SELECT DISTINCT ON (amm.token_id)
        amm.token_id,
        tx.amm_id,                  
        tx.price_per_unit AS current_price
    FROM amm_transaction tx
    JOIN amm_curve amm ON tx.amm_id = amm.id
    JOIN creator_token ct ON amm.id = ct.current_amm_sale_id
    ${currentBlockJoinStmt}
    WHERE
      tx.created_in > (${currentBlock} - ${periodDays * BLOCKS_PER_DAY})
    ORDER BY amm.token_id, tx.created_in DESC
),
tokens_with_fallback_tx AS (
    SELECT DISTINCT ON (amm.token_id)
        amm.token_id,
        tx.id,
        tx.price_per_unit AS fallback_tx_price          
    FROM amm_transaction tx
    JOIN amm_curve amm ON tx.amm_id = amm.id
    JOIN creator_token ct ON amm.id = ct.current_amm_sale_id
    ORDER BY amm.token_id, tx.created_in ASC
),
tokens_with_starting_tx AS (
    SELECT DISTINCT ON (amm.token_id)
        amm.token_id,
        tx.price_per_unit AS starting_price
    FROM amm_transaction tx
    JOIN amm_curve amm ON tx.amm_id = amm.id
    JOIN creator_token ct ON amm.id = ct.current_amm_sale_id
    ${currentBlockJoinStmt}
    WHERE
      tx.created_in <= (${currentBlock} - ${periodDays * BLOCKS_PER_DAY})
    ORDER BY amm.token_id, tx.created_in DESC
),
${
  minVolume
    ? `
tokens_with_period_volumes AS (
  SELECT
      amm.token_id,
      SUM(tx.price_paid) as period_volume
  FROM amm_transaction tx
  JOIN amm_curve amm ON tx.amm_id = amm.id
  JOIN creator_token ct ON amm.id = ct.current_amm_sale_id
  ${currentBlockJoinStmt}
  WHERE tx.created_in >= (${currentBlock} - ${periodDays * BLOCKS_PER_DAY})
  GROUP BY amm.token_id
  ORDER BY amm.token_id
),`
    : ''
}
tokens_with_price_change AS (
    SELECT
        t.id AS token_id,
        CASE
          WHEN twct.current_price IS NULL THEN 0
          ELSE (
            (twct.current_price - COALESCE(twst.starting_price, twft.fallback_tx_price))
            * 100.0
            / COALESCE(twst.starting_price, twft.fallback_tx_price)
          )
        END as percentage_change
    FROM creator_token t
    LEFT JOIN toknes_with_current_tx twct ON twct.token_id = t.id
    LEFT JOIN tokens_with_starting_tx twst ON twst.token_id = t.id
    JOIN tokens_with_fallback_tx twft ON twft.token_id = t.id
    ${
      minVolume
        ? `
        JOIN tokens_with_period_volumes twpv ON twpv.token_id = t.id
        WHERE twpv.period_volume >= ${minVolume}`
        : ''
    }
)`
}
