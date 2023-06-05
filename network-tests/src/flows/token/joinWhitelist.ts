import { FlowProps } from "../../Flow";
import { extendDebug } from "../../Debugger";
import { FixtureRunner } from "../../Fixture";
import { JoinWhitelistFixture, TransferFixture } from "../../fixtures/token";
import { expect } from "chai";
import { BN } from "bn.js";
import { Resource } from "../../Resources";

export default async function joinWhitelist({
  api,
  query,
  lock,
}: FlowProps): Promise<void> {
  const debug = extendDebug("flow:join-whitelist");
  debug("Started");
  api.enableDebugTxLogs();

  const tokenId = (await api.query.projectToken.nextTokenId()).toNumber() - 1;
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1;
  expect(tokenId).gte(1);
  expect(channelId).gte(1);

  const unlockFirstHolderAccess = await lock(Resource.FirstHolder);
  const [, firstHolderMemberId] = api.firstHolder;
  unlockFirstHolderAccess();

  const outputs = api.createType(
    "BTreeMap<u64, PalletProjectTokenPaymentWithVesting> "
  );
  outputs.set(
    api.createType("u64", firstHolderMemberId),
    api.createType("PalletProjectTokenPaymentWithVesting", {
      amount: api.createType("u128", new BN(1000)),
    })
  );
  const metadata = "";

  const joinWhitelistFixture = new JoinWhitelistFixture(
    api,
    query,
    creatorAddress,
    firstHolderMemberId,
    tokenId
  );
  await new FixtureRunner(joinWhitelistFixture).run();
}
