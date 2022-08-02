import { gql } from 'apollo-server-express'
import { KillSwitch } from '../../src/models/KillSwitch'

export const GET_KILL_SWITCH = gql`
  query GetKillSwitch {
    killSwitch {
      isKilled
    }
  }
`

export type GetKillSwitch = {
  killSwitch: {
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
  setKillSwitch: KillSwitch
}
export type SetKillSwitchArgs = {
  isKilled: boolean
}
