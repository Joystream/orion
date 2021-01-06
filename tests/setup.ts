export const TEST_BUCKET_SIZE = 20

jest.mock('../src/config', () => ({ bucketSize: TEST_BUCKET_SIZE }))
