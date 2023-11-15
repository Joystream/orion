import { EntityManager } from 'typeorm'
import { globalEm } from '../../utils/globalEm'
import { Account, Channel, NextEntityId, NotificationPreference } from '../../model'
import { expect } from 'chai'

const arePrefsAllTrue = (account: Account) =>
  Object.values(account.notificationPreferences).every((v: NotificationPreference) => {
    return v.inAppEnabled && v.emailEnabled
  })
const queryAccount = async (membershipId: string, em: EntityManager) => {
  return await em.getRepository(Account).findOneOrFail({
    where: { membershipId },
    relations: { notifications: true },
  })
}

describe('Migration from 3.0.2 to 3.2.0', () => {
  let em: EntityManager
  const aliceMembershipId = '16'
  const bobMembershipId = '17'
  before(async () => {
    em = await globalEm
  })
  describe('Accounts are migrated propelty', () => {
    let aliceAccount: Account
    let bobAccount: Account
    before(async () => {
      aliceAccount = await queryAccount(aliceMembershipId, em)
      bobAccount = await queryAccount(bobMembershipId, em)
    })
    it('should keep the accounts and add the preference Field all true', () => {
      expect(arePrefsAllTrue(aliceAccount)).to.be.true
      expect(arePrefsAllTrue(bobAccount)).to.be.true
    })
    it('notification accounts should be empty', () => {
      expect(aliceAccount.notifications).to.have.lengthOf(0)
      expect(bobAccount.notifications).to.have.lengthOf(0)
    })
    it('referrer channel id should be null', () => {
      expect(aliceAccount.referrerChannelId).to.be.null
      expect(bobAccount.referrerChannelId).to.be.null
    })
  })
  describe('Channels are migrated properly', () => {
    const aliceChannelId = '1'
    let aliceChannel: Channel
    before(async () => {
      aliceChannel = await em.getRepository(Channel).findOneByOrFail({ id: aliceChannelId })
    })
    it('channel should have ypp status marked as unverified', () => {
      expect(aliceChannel.yppStatus.isTypeOf).to.equal('YppUnverified')
    })
  })
  describe('Next Entity Ids migrated', () => {
    let row: NextEntityId
    describe('Account case', () => {
      before(async () => {
        row = await em.getRepository(NextEntityId).findOneByOrFail({ entityName: 'Account' })
      })
      it('should have the next id set to 3', () => {
        expect(row.nextId.toString()).to.equal('3')
      })
    })
  })
})
