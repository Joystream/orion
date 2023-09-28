import { expect } from 'chai'
import { EmailDeliveryAttempt, EmailDeliveryStatus, NotificationEmailDelivery } from '../../model'
import { EntityManager } from 'typeorm'
import { clearDb, populateDbWithSeedData } from './testUtils'
import { globalEm } from '../../utils/globalEm'
import { getFailedDeliveries, getMaxAttempts, sendFailed, sendNew } from '..'

describe('Scheduler', () => {
  const okNotificationId = 'OnChainNotification-1'
  const errNotificationId = 'OnChainNotification-2'
  let em: EntityManager

  before(async () => {
    em = await globalEm
  })

  beforeEach(async () => {
    await populateDbWithSeedData(em)
  })

  afterEach(async () => {
    await clearDb(em)
  })

  describe('case success at first attempt', () => {
    let emailDelivery: NotificationEmailDelivery
    before(async () => {
      await sendNew()

      emailDelivery = await em
        .getRepository(NotificationEmailDelivery)
        .findOneByOrFail({ notification: { id: okNotificationId } })
    })
    it('should change email delivery to discard when success', async () => {
      expect(emailDelivery.discard).to.be.true
    })

    it('should create a successful attempt', async () => {
      expect(emailDelivery.attempts[-1].notificationDeliveryId).to.equal(emailDelivery.id)
      expect(emailDelivery.attempts[-1].status.isTypeOf).to.equal('SuccessfulDelivery')
    })
  })
  it('should change EmailDeliveryStatus.deliveryStatus when failure', async () => {
    await sendNew()

    const result = await em
      .getRepository(EmailDeliveryStatus)
      .findOneByOrFail({ notificationDelivery: { notification: { id: errNotificationId } } })
    expect(result.deliveryStatus).to.equal(DeliveryStatus.FAILURE)
  })
  it('should create FailureReport when failure', async () => {
    await sendNew()

    const result = await em.getRepository(EmailDeliveryStatus).findOneOrFail({
      where: { notificationDelivery: { notification: { id: errNotificationId } } },
      relations: { failedDelivery: true },
    })

    expect(result.failedDelivery).to.not.be.empty
    expect(result.failedDelivery[0]).to.have.property('id')
    expect(result.failedDelivery[0]).to.have.property('timestamp').to.be.not.null
    expect(result.failedDelivery[0]).to.have.property('errorStatus').to.be.not.null
  })
  it('should keep EmailDeliveryStatus.deliveryStatus to failure on a failed second attempt', async () => {
    await sendNew()

    await sendFailed()

    const result = await em
      .getRepository(EmailDeliveryStatus)
      .findOneByOrFail({ notificationDelivery: { notification: { id: errNotificationId } } })

    expect(result.deliveryStatus).to.equal(DeliveryStatus.FAILURE)
  })
  it('should create another FailureReport when failure on retry', async () => {
    await sendNew()

    await sendFailed()

    const delivery = await em
      .getRepository(EmailDeliveryStatus)
      .findOneByOrFail({ notificationDelivery: { notification: { id: errNotificationId } } })

    const result = await getFailedDeliveries(em, delivery.id)

    expect(result).to.have.lengthOf(2)
    expect(result[1]).to.have.property('id')
    expect(result[1]).to.have.property('timestamp').to.be.not.null
    expect(result[1]).to.have.property('errorStatus').to.be.not.null
  })
  it('should set the EmailDeliveryStatus.deliveryStatus to Discard after N attempts', async () => {
    await sendNew() // first attempt
    const maxAttempts = await getMaxAttempts(em)

    for (let i = 0; i < maxAttempts - 1; i++) {
      await sendFailed()
    }

    const result = await em
      .getRepository(EmailDeliveryStatus)
      .findOneByOrFail({ notificationDelivery: { notification: { id: errNotificationId } } })

    expect(result.deliveryStatus).to.equal(DeliveryStatus.DISCARD)
  })
  it('should create at most N FailureReports after more than N attempts', async () => {
    await sendNew()
    const maxAttempts = await getMaxAttempts(em)

    // trying maxAttempts + 1 times
    for (let i = 0; i < maxAttempts; i++) {
      await sendFailed()
    }

    const result = await em.getRepository(EmailDeliveryStatus).findOneOrFail({
      where: { notificationDelivery: { notification: { id: errNotificationId } } },
      relations: { failedDelivery: true },
    })

    expect(result.failedDelivery).to.have.lengthOf(maxAttempts)
  })
})
