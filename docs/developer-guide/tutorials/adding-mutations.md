## Adding mutations

Adding new mutations is generally similar to [adding custom queries](./adding-custom-queries.md).
The baisc idea is that you add new method to a [custom resolver](https://docs.subsquid.io/graphql-api/custom-resolvers/), decorated with `@Mutation` [TypeGraphQL](https://typegraphql.com/) decorator.

However, usually when thinking about implementing mutations we need to consider the execution context. Most of the mutations will require some specific permissions, for example, they will only be available for the gateway operator or useres with registered accounts.

Another important thing to keep in mind when implementing mutations is the [visibility of the entities](./entity-visibility.md).

Let's assume we want to introduce a new mutation which will allow an account owner to cancel a report they have previously sent via `reportVideo` mutation.

In order to do that we can add a new method to `VideoResolver`:

```typescript
// src/server-extension/resolvers/VideosResolver/index.ts

import 'reflect-metadata'
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { Report } from '../../../model'
import { withHiddenEntities } from '../../../utils/sql'
import { Context } from '../../check'
import { AccountOnly } from '../middleware'
// ...

@Resolver()
export class VideosResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}
  // ...
  // Adding this middleware will prevent anyone who doesn't have an account from accessing
  // this mutation
  @UseMiddleware(AccountOnly)
  @Mutation(() => Boolean)
  async cancelVideoReport(
    @Arg('videoId') videoId: string,
    @Ctx() context: Context
  ): Promise<boolean> {
    const em = await this.em()
    // IMPORTANT! Because `Report` entities are hidden by default for anyone except the Gateway Operator,
    // we need to use `withHiddenEntities` wrapper. However, when using `withHiddenEntities` you need to
    // be careful not to expose the hidden data to the wrong / unauthorized actors
    return withHiddenEntities(em, async () => {
      const report = await em.findOneBy(Report, {
        videoId,
        // We're only interested in reports that have been sent from the currently logged-in account.
        accountId: context.accountId,
      })
      if (!report) {
        throw new Error(`Report not found`)
      }
      await em.remove(report)
      return true
    })
  }
}
```