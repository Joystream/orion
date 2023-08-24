import { assert } from 'chai'
import { Account, NotificationEmailDelivery, NotificationPreference } from '../../model'
import { defaultNotificationPreferences } from '../../utils/notification'
import { globalEm } from '../../utils/globalEm'
import { EntityManager } from 'typeorm'

// put contents of ./seedData.json in a variable
const seedData = require('./seedData.json')

describe('Scheduler', () => {
  let em: EntityManager

  // populate the database with seed data
  before(async () => {
    em = await globalEm
    for (const _account of seedData.accounts) {
      const account = new Account({
        ..._account,
        notificationPreferences: defaultNotificationPreferences(),
      })
      await em.save(account)
    }
    for (const _notification of seedData.notifications) {
      const notification = new Notification({
        ..._notification,
      })
      await em.save(notification)
    }
    for (const _notificationEmailDelivery of seedData.notificationEmailDeliveries) {
      const notificationEmailDelivery = new NotificationEmailDelivery({
        ..._notificationEmailDelivery,
      })
      em.save(notificationEmailDelivery)
    }
  })

  // check that seed date exists
  it('check that seed data exists', async () => {
    const result = await em.getRepository(Account).findBy({ id: seedData.accounts[0].id })
    assert.isNotNull(result)
  })
})
