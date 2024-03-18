import { Membership } from '../../model'
import { criticalError } from '../../utils/misc'
import { EntityManagerOverlay } from '../../utils/overlay'

export async function getMemberControllerAccount(
  overlay: EntityManagerOverlay,
  memberId: string
): Promise<string> {
  const membership = await overlay.getRepository(Membership).getByIdOrFail(memberId)

  if (!membership.controllerAccountId) {
    // This should never happen, but only added for type safety as
    // the foreign entity references are always set nullable by the
    // subsquid codegen even if in the graphql schema they are not.
    criticalError(`Membership ${membership.id} controller account not found.`)
  }
  return membership.controllerAccountId
}
