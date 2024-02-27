import { expect } from 'chai'
import { NotificationEmailDelivery, Notification } from '../../model'
import { clearDb, populateDbWithSeedData } from './testUtils'
import { globalEm } from '../../utils/globalEm'
import { getMaxAttempts, deliverEmails } from '..'
import { EntityManager } from 'typeorm'
import { RUNTIME_NOTIFICATION_ID_TAG } from '../../utils/notification/helpers'

const getDeliveryFromNotificationId = async (em: EntityManager, notificationId: string) => {
  const res = await em.getRepository(NotificationEmailDelivery).findOneOrFail({
    where: { notification: { id: notificationId } },
    relations: { attempts: true },
  })
  return res
}

const correctRecipientAccountEmail = async (em: EntityManager, notificationId: string) => {
  const accountId = (await em.getRepository(Notification).findOneByOrFail({ id: notificationId }))
    .accountId
  const account = await em.getRepository('Account').findOneByOrFail({ id: accountId })
  account.email = `correct-${accountId}@example.com`
  await em.save(account)
}

describe('Scheduler', () => {
  const okNotificationId = RUNTIME_NOTIFICATION_ID_TAG + '-0'
  const errNotificationId = RUNTIME_NOTIFICATION_ID_TAG + '-1'
  const okAtSecondNotificationId = RUNTIME_NOTIFICATION_ID_TAG + '-2'
  let successfulDelivery: NotificationEmailDelivery
  let failingDelivery: NotificationEmailDelivery
  let successfulAtSecondDelivery: NotificationEmailDelivery
  let em: EntityManager
  let maxAttempts: number

  before(async () => {
    em = await globalEm
    maxAttempts = await getMaxAttempts(em)
    await populateDbWithSeedData()
  })

  after(async () => {
    await clearDb()
  })

  describe('1️⃣ first run of deliverEmails', () => {
    before(async () => {
      await correctRecipientAccountEmail(em, okNotificationId)
      await deliverEmails()
      successfulDelivery = await getDeliveryFromNotificationId(em, okNotificationId)
      failingDelivery = await getDeliveryFromNotificationId(em, errNotificationId)
      successfulAtSecondDelivery = await getDeliveryFromNotificationId(em, okAtSecondNotificationId)
    })
    describe('successful delivery case: 👍', () => {
      it('should change email delivery to discard when success', async () => {
        expect(successfulDelivery.discard).to.be.true
      })
      it('should create a successful attempt', async () => {
        expect(successfulDelivery.attempts).to.have.lengthOf(1)
        expect(successfulDelivery.attempts[0].notificationDeliveryId).to.equal(
          successfulDelivery.id
        )
        expect(successfulDelivery.attempts[0].status.isTypeOf).to.equal('EmailSuccess')
      })
    })
    describe('failing delivery case: 👎', () => {
      it('should keep email delivery discard to false', () => {
        expect(failingDelivery.discard).to.be.false
      })
      it('should create a failed attempt', () => {
        expect(failingDelivery.attempts).to.have.lengthOf(1)
        expect(failingDelivery.attempts[0].notificationDeliveryId).to.equal(failingDelivery.id)
        expect(failingDelivery.attempts[0].status.isTypeOf).to.equal('EmailFailure')
      })
    })
    describe('successful at second attempt delivery case: 👎', () => {
      it('should keep email delivery discard to false', () => {
        expect(successfulAtSecondDelivery.discard).to.be.false
      })
      it('should create a failed attempt', () => {
        expect(successfulAtSecondDelivery.attempts).to.have.lengthOf(1)
        expect(successfulAtSecondDelivery.attempts[0].notificationDeliveryId).to.equal(
          successfulAtSecondDelivery.id
        )
        expect(successfulAtSecondDelivery.attempts[0].status.isTypeOf).to.equal('EmailFailure')
      })
    })
    describe('2️⃣ second run of deliverEmails', () => {
      before(async () => {
        await correctRecipientAccountEmail(em, okAtSecondNotificationId)
        await deliverEmails()
        failingDelivery = await getDeliveryFromNotificationId(em, errNotificationId)
        successfulAtSecondDelivery = await getDeliveryFromNotificationId(
          em,
          okAtSecondNotificationId
        )
      })
      describe('failing delivery case: 👎', () => {
        it('should keep email delivery discard to false', () => {
          expect(failingDelivery.discard).to.be.false
        })
        it('should create another failed attempt', () => {
          expect(failingDelivery.attempts).to.have.lengthOf(2)
          expect(failingDelivery.attempts[0].notificationDeliveryId).to.equal(failingDelivery.id)
          expect(failingDelivery.attempts[0].status.isTypeOf).to.equal('EmailFailure')
          expect(failingDelivery.attempts[1].status.isTypeOf).to.equal('EmailFailure')
        })
      })
      describe('successful at second delivery case: 👍', () => {
        it('should change email delivery to discard when success', async () => {
          expect(successfulAtSecondDelivery.discard).to.be.true
        })
        it('should create a new successful attempt', async () => {
          expect(successfulAtSecondDelivery.attempts).to.have.lengthOf(2)
          expect(successfulAtSecondDelivery.attempts[1].notificationDeliveryId).to.equal(
            successfulAtSecondDelivery.id
          )
          expect(successfulAtSecondDelivery.attempts[1].status.isTypeOf).to.equal('EmailSuccess')
        })
      })
      describe('3️⃣ MAX_ATTEMPTS - 2 runs of deliverEmails', () => {
        before(async () => {
          const maxAttempts = await getMaxAttempts(em)
          expect(maxAttempts).to.be.greaterThan(2)
          for (let i = 0; i < maxAttempts - 2; i++) {
            await deliverEmails()
          }
          failingDelivery = await getDeliveryFromNotificationId(em, errNotificationId)
        })
        describe('failing delivery case: 👎', () => {
          it('should set the email delivery discard to true after MAX_ATTEMPTS', async () => {
            expect(failingDelivery.discard).to.be.true
          })
          it('should create MAX_ATTEMPTS failed attempts', async () => {
            const attemptsStatus = failingDelivery.attempts.map(
              (attempt) => attempt.status.isTypeOf
            )
            expect(failingDelivery.attempts).to.have.lengthOf(maxAttempts)
            expect(attemptsStatus.every((status) => status === 'EmailFailure')).to.be.true
          })
        })
        describe('4️⃣ one more run of deliverEmails', () => {
          before(async () => {
            await deliverEmails()
            failingDelivery = await getDeliveryFromNotificationId(em, errNotificationId)
          })
          describe('failing delivery case: 👎', () => {
            it('should not create more MAX_ATTEMPTS failed attempts', async () => {
              const attemptsStatus = failingDelivery.attempts.map(
                (attempt) => attempt.status.isTypeOf
              )
              expect(failingDelivery.attempts).to.have.lengthOf(maxAttempts)
              expect(attemptsStatus.every((status) => status === 'EmailFailure')).to.be.true
            })
          })
        })
      })
    })
  })
})
