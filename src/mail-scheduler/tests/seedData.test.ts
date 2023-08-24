import { assert, expect } from 'chai'
import {
  Account,
  ChannelCreated,
  EmailDeliveryStatus,
  FailedDelivery,
  MemberRecipient,
  Membership,
  Notification,
  NotificationEmailDelivery,
  SuccessDelivery,
  Unread,
  Unsent,
  User,
  fromJsonEmailDeliveryStatus,
} from '../../model'
import { defaultNotificationPreferences } from '../../utils/notification'
import { globalEm } from '../../utils/globalEm'
import { EntityManager, FindOptionsWhere } from 'typeorm'
import _ from 'lodash'
import { clearDb, populateDbWithSeedData } from './testUtils'

// put contents of ./seedData.json in a variable
const seedData = require('./seedData.json')

describe('Database seed data tests', () => {
  let em: EntityManager

  describe('seed data database population', () => {
    // populate the database with seed data
    before(async () => {
      em = await globalEm
      await populateDbWithSeedData(em)
    })

    // check that seed date exists
    it('check that seed data exists', async () => {
      const result = await em
        .getRepository(Account)
        .findOne({ where: { id: seedData.accounts[0].id }, relations: { membership: true } })
      expect(result).to.not.be.null
      expect(result?.membership.handle).to.equal(seedData.memberships[0].handle)
    })
    it('check that notification delivery entity is correct', async () => {
      const result = await em.getRepository(NotificationEmailDelivery).findOne({
        where: {
          deliveryStatus: fromJsonEmailDeliveryStatus({
            isTypeOf: 'Unsent',
            phantom: undefined,
          }) as unknown as FindOptionsWhere<EmailDeliveryStatus>,
        },
        relations: { notification: { account: true } },
      })

      expect(result).to.not.be.null
      expect(result?.notification.account.id).to.equal(seedData.accounts[0].id)
    })
  })

  describe('database cleanup', () => {
    before(async () => {
      await clearDb(em)
    })
    it('should clear the database', async () => {
      const accounts = await em.getRepository(Account).find({})
      const notifications = await em.getRepository(Notification).find({})
      const deliveries = await em.getRepository(NotificationEmailDelivery).find({})
      const successDeliveries = await em.getRepository(SuccessDelivery).find({})
      const failedDeliveries = await em.getRepository(FailedDelivery).find({})

      expect(accounts).to.be.empty
      expect(notifications).to.be.empty
      expect(deliveries).to.be.empty
      expect(successDeliveries).to.be.empty
      expect(failedDeliveries).to.be.empty
    })
  })
})
