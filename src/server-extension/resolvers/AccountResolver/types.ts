import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ConnectedAccountData {
  @Field(() => String, { nullable: false })
  address!: string

  @Field(() => [String], { nullable: false })
  membershipIds!: string[]

  @Field(() => Boolean, { nullable: false })
  isLoginAllowed!: boolean
}

@ObjectType()
export class AccountData {
  @Field(() => String, { nullable: false })
  email!: string

  @Field(() => [ConnectedAccountData], { nullable: false })
  connectedAccounts!: ConnectedAccountData[]
}
