## Orion Operator Guide
For a technical intro start [here](https://github.com/Joystream/orion/blob/master/docs/developer-guide.md).
1. Clone and checkout the master branch of this repository.
```
git clone https://github.com/Joystream/orion
make prepare && make up
```
2. Configure the node endpoint in `archive/.env`: change `WS_SOURCE=wss://rpc.joystream.org:9944` or if you're running `joystream-node` as a docker service you can try putting it on the same docker network as your local archive and then use the docker service name as host (for example `ws://joystream-node:9944`) or run the node container and connect to that:
3. `make up-archive # now it's syncing`
3. Check that it works: `docker logs -f -n 10 orion_archive_ingest` should return something like
> {"level":2,"time":1687403029544,"ns":"sqd:substrate-ingest","msg":"last block: 2792182, progress: 669 blocks/sec, write: 2157 blocks/sec"│

### Upgrading
To save video stats and followings run `make down` which will export data to `db/persisted` (if you ran in on the old version of Orion) or db/export.json (orion2).

For a start see this [guide](https://github.com/Lezek123/orion/blob/user-accounts/docs/operator-guide/tutorials/upgrading-orion.md).

Files in `db/*-Data.js` are used to setup tables when orion is started with `make up-squid` (called by `make up`) and need to be cleared when upgrading to orion2/3 or [migrations may fail](https://github.com/Joystream/orion/issues/150).
```
make down
remove db/*-Data.js
make dbgen
make up
```
