import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class OrionOffchainCursor {
  constructor(props?: Partial<OrionOffchainCursor>) {
    Object.assign(this, props)
  }

  /**
   * Name of the offchain cursor
   */
  @PrimaryColumn()
  cursorName!: string

  /**
   * Value of the cursor
   */
  @Column('int8', { nullable: false })
  value!: number
}
