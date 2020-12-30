/* eslint-disable @typescript-eslint/no-var-requires */

const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: '@shelf/jest-mongodb',
  transform: tsjPreset.transform,
  setupFiles: ['./tests/setup.ts'],
}
