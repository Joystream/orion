import { expect } from 'chai'
import { sendNew } from '..'
// add a mocha describe with one it
describe('Scheduler', () => {
  it('should set the delivery status succes when success', async () => {
    await sendNew()
  })
  it('should create the SucessDelivery entity when success', () => {})
  it('should set the delivery status failure when failure', () => {})
  it('should create the FailedDelivery entity when success', () => {})
  it('should set the delivery status as discard after max attempts', () => {})
})
