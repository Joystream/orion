import { Api } from '../../Api'
import { StandardizedFixture } from '../../Fixture'
import { OrionApi } from '../../OrionApi'
import { WorkingGroupModuleName } from '../../types'

export abstract class BaseWorkingGroupFixture extends StandardizedFixture {
  protected group: WorkingGroupModuleName

  public constructor(api: Api, query: OrionApi, group: WorkingGroupModuleName) {
    super(api, query)
    this.group = group
  }
}
