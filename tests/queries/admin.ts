import { gql } from 'apollo-server-express'
import { Admin } from '../../src/models/Admin'

export const GET_KILL_SWITCH = gql`
  query GetKillSwitch {
    admin {
      isKilled
    }
  }
`

export type GetKillSwitch = {
  admin: {
    isKilled: boolean
  }
}

export const SET_KILL_SWITCH = gql`
  mutation SetKillSwitch($isKilled: Boolean!) {
    setKillSwitch(isKilled: $isKilled) {
      isKilled
    }
  }
`

export type SetKillSwitch = {
  setKillSwitch: Admin
}
export type SetKillSwitchArgs = {
  isKilled: boolean
}
