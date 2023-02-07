import { compareState } from './compareState'

async function main() {
  await compareState()
}

main()
  .then(() => console.log('Done'))
  .catch(console.error)
