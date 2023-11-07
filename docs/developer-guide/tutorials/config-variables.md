# Managing config variables

Orion currently has a feature which allows persisting configuration variables of different types in the database.
The entity which describes a configuration variable is called [`GatewayConfig`](../../../src/model/GatewayConfig.ts).

The logic of retrieving, setting and updating configuration variables is defined in [`src/utils/config.ts`](../../../src/utils/config.ts).

Each config variable specified in [`src/utils/config.ts`](../../../src/utils/config.ts) has a corresponding environment variable which serves as a default value in case the config value is not set (stored) in the database.

Config variables are part of the so called _Offchain state_ and can be preserved across Orion upgrades, as described in _[Preserving offchain state](./preserving-offchain-state.md)_ guide.

## Adding a new config variable

Let's imagine we want to add a new config variable called `AllowedCountries`, which will be either a comma-separated list of country codes (e.g. `US`, `GB`, `DE`, etc.), specifying countries from which the Orion API can be accessed, or a string `'ALL'` if the API should be accessible from all countries.

The process of adding such config variable will consist of the following steps:

1. Set a sane default value for the config variable in the [`.env`](../../../.env) file:
    ```bash
    # .env
    # ...
    ALLOWED_COUNTRIES=ALL
    ```
2. Add a new variant to the `ConfigVariable` enum in [`src/utils/config.ts`](../../../src/utils/config.ts). The value of the variant should be the name of the environment variable from the previous step:
    ```typescript
    // src/utils/config.ts
    export enum ConfigVariable {
      // ...
      AllowedCountries = 'ALLOWED_COUNTRIES',
    }
    ```
3. Add a parser to the `configVariables` map. The parser consists of 2 methods: `serialize` and `deserialize`. The `serialize` method converts the value (an array, object, number, etc.) to a string representation (stored in the database), while `deserialize` converts the string representation stored in the environment variable or in the database to the target type (an array, object, number, etc.). We could use some already existing parser, like `jsonType`, but to show a more advanced example, we will provide a custom parser:
    ```typescript
    // src/utils/config.ts
    export const configVariables = {
      // ...
      [ConfigVariable.AllowedCountries]: {
        serialize: (value: string[] | 'ALL') => Array.isArray(value) ? value.join(',') : value,
        deserialize: (value: string) => value.toLowerCase() === 'all' ? 'ALL' : value.split(','),
      },
    } as const
    ```
4. We can now add a mutation which will allow the Gateway operator the change the value of the config variable. To do this we can follow the [Adding mutations](./adding-mutations.md) guide, but just to provide a simple example:
    ```typescript
    // src/server-extension/resolvers/AdminResolver/index.ts
    import { Mutation, Resolver, UseMiddleware, Arg } from 'type-graphql'
    import { EntityManager } from 'typeorm'
    import { OperatorOnly } from '../middleware'
    import { config, ConfigVariable } from '../../../utils/config'
    // ...

    @Resolver()
    export class AdminResolver {
      // Set by dependency injection
      constructor(private em: () => Promise<EntityManager>) {}
      // ...
      @UseMiddleware(OperatorOnly)
      @Mutation(() => String)
      async setAllowedCountries(
        @Arg('allowAll', { nullable: true }) allowAll: boolean | undefined,
        @Arg('countries', () => [String], { nullable: true }) countries: string[] | undefined
      ) {
        const em = await this.em()
        const newValue = allowAll ? 'ALL' : countries
        if (newValue !== undefined) {
          // Use `config.set` to set the value of the config variable
          await config.set(ConfigVariable.AllowedCountries, newValue, em)
        }

        // Use `config.get` to retrieve the current value of the config variable
        return JSON.stringify(await config.get(ConfigVariable.AllowedCountries, em))
      }
    }
    ```
