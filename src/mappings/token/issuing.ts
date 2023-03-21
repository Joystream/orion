// import { EventHandlerContext } from '../../utils/events'
// import { Token, TokenStatus } from '../../model'
// import { TokenAllocation } from '../../types/v1001';
// import { bigint } from '../../model/generated/marshal';

// export async function processTokenIssuedEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       {
//         initialAllocation,
//         symbol,
//         transferPolicy,
//         patronageRate,
//         revenueSplitRate
//       }],
//   },
// }: EventHandlerContext<'ProjectToken.TokenIssued'>) {
//   // 1. create tokens(symbol, transferPolicy, patronageRate)
//   const vestingScheduleParams = initialAllocation.map(([memberId, allocation]) => {
//     return [memberId, allocation.vestingScheduleParams]
//   });
//   const totalSupply = initialAllocation.reduce((acc, [_, allocation]) =>{
//     return acc + allocation.amount
//   }, BigInt(0))
//   const token = overlay.getRepository(Token).new({
//     id: tokenId.toString(),
//     status: TokenStatus.IDLE,
//     createdIn: block.height,
//     totalSupply,
//     revenueShareRatioPercent: revenueSplitRate,
//   })
//   // 2. create new account with member(initialAllocation[])
// }

// export async function processTokenAmountTransferredEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       sourceMemberId,
//       validatatedTransfers,
//     ],
//   }
// }: EventHandlerContext<'ProjectToken.TokenAmountTransferred'>) {
//   // 1. edit accounts sourceMemberId and validatedTransfers
// }

// export async function processTokenAmountTransferredByIssuerEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       sourceMemberId,
//       validatedTransfers,
//     ],
//   },
// }: EventHandlerContext<'ProjectToken.TokenAmountTransferredByIssuer'>) {
//   // 1. edit accounts sourceMemberId and validatedTransfers
//   // 2. Eventually create new account
//   // 3. eventually update vesting schedules
// }

// export async function processTokenDeissuedEvent(
//   {
//     overlay,
//     block,
//     event: {
//       asV1001: [
//         tokenId
//       ]
//     }
//   }: EventHandlerContext<'ProjectToken.TokenAmountTransferredByIssuer'>) {
//   // 1. remove token Id
//   // 2. cascade remove
// }

// export async function processAccountDustedByEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       dustedAccountId,
//       sender,
//       policy,
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.AccountDustedBy'>) {
//   // 1. remove account
// }

// export async function processAmmActivatedEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       memberId,
//       {
//         slope,
//         intercept,
//       }
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.AmmActivated'>) {
//   // 1. create new AMM Curve
//   // 2. add it as a reference to token
// }

// export async function processMemberJoinedWhitelistEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       memberId,
//       policy,
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.MemberJoinedWhitelist'>) {
//   // 1. create new account
// }

// export async function processPatronageCreditClaimedEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       creditAmount,
//       memberId,
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.PatronageCreditClaimed'>) {
//   // 1. create new account
// }

// export async function processPatronageRateDecreasedEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       newRate,
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.PatronageRateDecreasedTo'>) {
//   // 1. decrease Token.reward
// }

// export async function processRevenueSplitfinalizedEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       _recoveryAccount,
//       leftoverFunds,
//     ]
//   }

// }: EventHandlerContext<'ProjectToken.RevenueSplitFinalized'>) { }
