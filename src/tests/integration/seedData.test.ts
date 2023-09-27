import { expect } from 'chai'
import { Account, Auction, AuctionTypeEnglish, Channel, OwnedNft } from '../../model'
import { globalEm } from '../../utils/globalEm'
import { EntityManager } from 'typeorm'
import _ from 'lodash'
import { clearDb, populateDbWithSeedData } from './testUtils'

describe('Database seed data tests', () => {
  let em: EntityManager

  describe('seed data database population', () => {
    // populate the database with seed data
    before(async () => {
      em = await globalEm
      await populateDbWithSeedData()
    })

    // check that seed date exists
    it('check that seed membership data exists', async () => {
      const result = await em
        .getRepository(Account)
        .findOne({ where: { id: '1' }, relations: { membership: true } })
      expect(result).to.not.be.null
      expect(result?.membership.id).to.equal('1')
    })

    describe('check that seed content entities exists', () => {
      it('check that seed channel data exists', async () => {
        const result = await em
          .getRepository(Channel)
          .findOne({ where: { id: '1' }, relations: { videos: true } })
        expect(result).to.not.be.null
        expect(result?.rewardAccount).to.equal(`test-reward-account-1`)
        expect(result?.videos).to.have.length.above(0)
        expect(result?.videos[0].id).to.equal('1')
      })
      it('check that seed NFT data exists', async () => {
        const result = await em
          .getRepository(OwnedNft)
          .findOne({ where: { id: '1' }, relations: { video: true } })
        expect(result).to.not.be.null
        expect(result!.video.id).to.equal('1')
        expect(result!.isFeatured).to.be.false
        // expect this to be falsly
        expect(result!.creatorRoyalty).to.be.undefined
        expect(result!.transactionalStatus?.isTypeOf).to.equal('TransactionalStatusIdle')
        expect(result!.lastSalePrice).to.be.undefined
      })
      it('checks that auction data exist', async () => {
        const result = await em
          .getRepository(Auction)
          .findOne({ where: { id: '1' }, relations: { bids: true } })
        expect(result).to.not.be.null
        expect(result?.nftId).to.equal('5')
        expect(result?.auctionType.isTypeOf).to.equal('AuctionTypeEnglish')
        expect((result?.auctionType as AuctionTypeEnglish).duration).to.equal(100)
        expect((result?.auctionType as AuctionTypeEnglish).extensionPeriod).to.equal(10)
        expect(result?.bids).to.have.length(5)
      })
    })
  })

  describe('database cleanup', () => {
    before(async () => {
      await clearDb()
    })
    it('should clear the database', async () => {
      const accounts = await em.getRepository(Account).find({})

      expect(accounts).to.be.empty
    })
  })
})
