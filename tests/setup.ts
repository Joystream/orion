export const TEST_BUCKET_SIZE = 20

jest.mock('../src/config', () => ({ bucketSize: TEST_BUCKET_SIZE }))

process.env.ORION_QUERY_NODE_URL = 'https://sumer-dev-2.joystream.app/query/server/graphql'
