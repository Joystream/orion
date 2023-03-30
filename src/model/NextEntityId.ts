import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class NextEntityId {
  constructor(props?: Partial<NextEntityId>) {
    Object.assign(this, props)
  }

  /**
   * Name of the entity model
   */
  @PrimaryColumn()
  entityName!: string

  /**
   * Next id of the entity
   */
  @Column('int8', { nullable: false })
  nextId!: number
}
