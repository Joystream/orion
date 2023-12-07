import { expect } from 'chai'
import { formatJOY } from '../helpers'

describe('formatJOY', () => {
  it('Parse HAPI amounts into JOY values', () => {
    expect(formatJOY(0)).to.equal('0 $JOY')
    expect(formatJOY(1)).to.equal('0.0000000001 $JOY')
    expect(formatJOY(9)).to.equal('0.0000000009 $JOY')
    expect(formatJOY(10)).to.equal('0.000000001 $JOY')
    expect(formatJOY(94)).to.equal('0.000000009 $JOY')
    expect(formatJOY(95)).to.equal('0.00000001 $JOY')
    expect(formatJOY(100000000)).to.equal('0.01 $JOY')
    expect(formatJOY(1000000000)).to.equal('0.10 $JOY')

    expect(formatJOY(1_0000000000)).to.equal('1 $JOY')
    expect(formatJOY(1_0100000000)).to.equal('1.01 $JOY')
    expect(formatJOY(1_1000000000)).to.equal('1.10 $JOY')
    expect(formatJOY(1_0000000001)).to.equal('1 $JOY')
    expect(formatJOY(1_0040000000)).to.equal('1 $JOY')
    expect(formatJOY(1_0050000000)).to.equal('1.01 $JOY')
    expect(formatJOY(1_0900000000)).to.equal('1.09 $JOY')
    expect(formatJOY(1_0912000000)).to.equal('1.09 $JOY')
    expect(formatJOY(1_0950000000)).to.equal('1.10 $JOY')
    expect(formatJOY(1_0250000000)).to.equal('1.03 $JOY')

    expect(formatJOY(1_000_0000000000)).to.equal('1 000 $JOY')
    expect(formatJOY(1_000_0000000001)).to.equal('1 000 $JOY')
    expect(formatJOY(1_000_1000000000)).to.equal('1 000.10 $JOY')
    expect(formatJOY(100_000_0000000000)).to.equal('100 000 $JOY')
    expect(formatJOY(1_000_000_0000000000n)).to.equal('1 000 000 $JOY')
  })
})
