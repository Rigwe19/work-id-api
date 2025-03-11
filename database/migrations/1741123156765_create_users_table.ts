import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('phone', 20).notNullable()
      table.string('work_id', 30).nullable()
      table.string('username', 200).notNullable().unique()
      // table.integer('balance').defaultTo(0)
      // table.string('pin', 4).nullable()
      table.boolean('verified').defaultTo(false)
      table.integer('verification_code').nullable()
      table.integer('passwordReset_code').nullable()
      table.enum('role', ['employee', 'employer', 'admin']).defaultTo('employee')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
