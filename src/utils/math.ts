import _ from 'lodash'

export function median(arr: number[]): number {
  arr.sort((a, b) => a - b)
  return arr.length % 2
    ? arr[Math.floor(arr.length / 2)]
    : _.mean(arr.slice(arr.length / 2 - 1, arr.length / 2 + 1))
}
