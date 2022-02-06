exports.up = async function (knex) {
    return await knex.schema.createTable('anotacao', table => {
        table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
        table.uuid('id_paciente').references('paciente.id_usuario').notNullable().onDelete('CASCADE')
        table.text('descricao').notNullable()

        table.timestamp('criado_em').defaultTo(knex.fn.now()).notNullable()
    })
  }
  
  exports.down = async function (knex) {
    return await knex.schema.dropTable('anotacao');
  }
  