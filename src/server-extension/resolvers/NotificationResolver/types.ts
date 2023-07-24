import { Field, ObjectType, ArgsType } from 'type-graphql'
import { AccountNotificationPreferences } from '../../../model'

@ArgsType()
export class NotificationArgs {
  @Field(() => [String], { nullable: false })
  notificationIds!: string[]
}
@ArgsType()
export class SetNotificationPreferencesArgs {
  @Field(() => AccountNotificationPreferences, { nullable: false })
  newPreferences: AccountNotificationPreferences
}
@ObjectType()
export class SetNotificationPreferencesReturn {
  @Field(() => AccountNotificationPreferences, { nullable: false })
  newPreferences: AccountNotificationPreferences
}
