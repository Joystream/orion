import { expect } from 'chai'
import { DeliveryStatus, EmailDeliveryStatus } from '../../model'
import { EntityManager } from 'typeorm'
import { clearDb, populateDbWithSeedData } from './testUtils'
import { globalEm } from '../../utils/globalEm'
import { sendFailed, sendNew } from '..'

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

  it('should change EmailDeliveryStatus.deliveryStatus when success', async () => {
    await sendNew()

    const result = await em
      .getRepository(EmailDeliveryStatus)
      .findOneByOrFail({ notificationDelivery: { notification: { id: okNotificationId } } })
    expect(result.deliveryStatus).to.equal(DeliveryStatus.SUCCESS)
  })

  it('should create SuccessReport when successful', async () => {
    await sendNew()

    const result = await em.getRepository(EmailDeliveryStatus).findOneOrFail({
      where: { notificationDelivery: { notification: { id: okNotificationId } } },
      relations: { successDelivery: { successReport: true } },
    })

    expect(result.successDelivery).to.not.be.empty
    expect(result.successDelivery[0].successReport).to.have.property('id')
    expect(result.successDelivery[0].successReport).to.have.property('timestamp').to.be.not.null
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
      relations: { failureDelivery: { failureReport: true } },
    })

    expect(result.failureDelivery).to.not.be.empty
    expect(result.failureDelivery[0].failureReport).to.have.property('id')
    expect(result.failureDelivery[0].failureReport).to.have.property('timestamp').to.be.not.null
    expect(result.failureDelivery[0].failureReport).to.have.property('errorCode').to.be.not.null
  })
  it('should keep EmailDeliveryStatus.deliveryStatus to failure on a failed second attempt', async () => {
    await sendNew()

    await sendFailed()

    const result = await em
      .getRepository(EmailDeliveryStatus)
      .findBy({ notificationDelivery: { notification: { id: errNotificationId } } })
    expect(result).to.have.lengthOf(2)
    expect(result[1].deliveryStatus).to.equal(DeliveryStatus.FAILURE)
  })
  it('should create another FailureReport when failure on retry', async () => {
    await sendNew()

    await sendFailed()

    const result = await em.getRepository(EmailDeliveryStatus).findOneOrFail({
      where: { notificationDelivery: { notification: { id: errNotificationId } } },
      relations: { failureDelivery: { failureReport: true } },
    })

    expect(result.failureDelivery).to.not.have.lengthOf(2)
    expect(result.failureDelivery[1].failureReport).to.have.property('id')
    expect(result.failureDelivery[1].failureReport).to.have.property('timestamp').to.be.not.null
    expect(result.failureDelivery[1].failureReport).to.have.property('errorCode').to.be.not.null
  })
  it('should set the EmailDeliveryStatus.deliveryStatus to Discard after N attempts', async () => {
    await sendNew() // first attempt
    const maxAttempts = Number(process.env.MAX_ATTEMPTS) || 5

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
    const maxAttempts = Number(process.env.MAX_ATTEMPTS) || 5

    // trying maxAttempts + 1 times
    for (let i = 0; i < maxAttempts; i++) {
      await sendFailed()
    }

    const result = await em.getRepository(EmailDeliveryStatus).findOneOrFail({
      where: { notificationDelivery: { notification: { id: errNotificationId } } },
      relations: { failureDelivery: { failureReport: true } },
    })

    expect(result.failureDelivery).to.have.lengthOf(maxAttempts)
  })
})
