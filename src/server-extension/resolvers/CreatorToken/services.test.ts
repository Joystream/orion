import { expect } from 'chai'
import { computeTransferrableAmount } from './services'

describe('Creator Token Services', () => {
  describe('Transferrable Balance computation with zero staked', () => {
    const cliffBlock = 264034
    const duration = 1555200
    const endsAt = cliffBlock + duration

    const tokenAccount = {
      vestingSchedules: [
        {
          vesting: {
            cliffBlock,
            vestingDurationBlocks: 1555200,
            cliffRatioPermill: 500000,
            endsAt: 1819234,
            id: '2640-100-200',
            cliffDurationBlocks: 0,
            accounts: ['1'],
          },
          totalVestingAmount: 1000n,
        },
      ],
      totalAmount: 1000n,
      stakedAmount: 0n,
    }
    it('should compute the transferrable balance correctly before the cliff block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, cliffBlock - 10)
      expect(result).equal(0n)
    })
    it('should compute the transferrable balance correctly starting at cliff block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, cliffBlock)
      expect(result).equal(500n)
    })
    it('should compute the transferrable balance correctly halfway through vesting', () => {
      const result = computeTransferrableAmount(tokenAccount as any, cliffBlock + duration / 2)
      expect(result).equal(750n)
    })
    it('should compute the transferrable balance correctly at endBlock block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, endsAt)
      expect(result).equal(1000n)
    })
    it('should compute the transferrable balance correctly after at endBlock block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, endsAt + 10)
      expect(result).equal(1000n)
    })
  })
  describe('Transferrable Balance computation with zero vesting', () => {
    const cliffBlock = 264034

    const tokenAccount = {
      totalAmount: 2000n,
      stakedAmount: 1000n,
    }
    it('should compute the transferrable balance correctly before the cliff block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, cliffBlock)
      expect(result).equal(1000n)
    })
  })
  describe('Transferrable Balance computation with zero vesting and zero staked', () => {
    const cliffBlock = 264034

    const tokenAccount = {
      totalAmount: 1000n,
    }
    it('should compute the transferrable balance correctly before the cliff block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, cliffBlock)
      expect(result).equal(1000n)
    })
  })
  describe('Transferrable Balance computation general case', () => {
    const cliffBlock = 264034
    const duration = 1555200
    const endsAt = cliffBlock + duration

    const tokenAccount = {
      vestingSchedules: [
        {
          vesting: {
            cliffBlock,
            vestingDurationBlocks: 1555200,
            cliffRatioPermill: 500000,
            endsAt: 1819234,
            id: '2640-100-200',
            cliffDurationBlocks: 0,
            accounts: ['1'],
          },
          totalVestingAmount: 1000n,
        },
      ],
      totalAmount: 2000n,
      stakedAmount: 600n,
    }
    it('should compute the transferrable balance correctly before the cliff block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, cliffBlock - 10)
      expect(result).equal(1000n)
    })
    it('should compute the transferrable balance correctly starting at cliff block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, cliffBlock)
      expect(result).equal(1400n)
    })
    it('should compute the transferrable balance correctly halfway through vesting', () => {
      const result = computeTransferrableAmount(tokenAccount as any, cliffBlock + duration / 2)
      expect(result).equal(1400n)
    })
    it('should compute the transferrable balance correctly at endBlock block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, endsAt)
      expect(result).equal(1400n)
    })
    it('should compute the transferrable balance correctly after at endBlock block', () => {
      const result = computeTransferrableAmount(tokenAccount as any, endsAt + 10)
      expect(result).equal(1400n)
    })
  })
})
