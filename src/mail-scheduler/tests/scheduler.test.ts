import { expect } from 'chai'
import { NotificationEmailDelivery } from '../../model'
import { EntityManager } from 'typeorm'
import { clearDb, populateDbWithSeedData } from './testUtils'
import { globalEm } from '../../utils/globalEm'
import { sendNew } from '..'
// add a mocha describe with one it
describe('Scheduler', () => {
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
  it('should set the delivery status succes when success', async () => {
    const deliveryId = '1'
    await sendNew()
    const successDelivery = await em
      .getRepository(NotificationEmailDelivery)
      .findOneByOrFail({ id: deliveryId })

    expect(successDelivery.deliveryStatus.isTypeOf).to.equal('Success')
  })
  it('should create the SucessDelivery entity when success', () => {})
  it('should set the delivery status failure when failure', () => {})
  it('should create the FailedDelivery entity when success', () => {})
  it('should set the delivery status as discard after max attempts', () => {})
})
