exports.up = async function (knex) {
    return await knex.schema.createTable('consulta', table => {
        table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
        table.uuid('id_medico').references('medico.id_usuario').notNullable().onDelete('CASCADE')
        table.uuid('id_paciente').references('paciente.id_usuario').onDelete('CASCADE')
        table.text('status').notNullable()
        table.timestamp('dt_hr_consulta')

        table.timestamp('criado_em').defaultTo(knex.fn.now()).nullable()
        table.uuid('criado_por')
        table.timestamp('atualizado_em').defaultTo(knex.fn.now()).nullable()
        table.uuid('atualizado_por')
        table.timestamp('cancelado_em')
        table.uuid('cancelado_por')
    })
  }
  
  exports.down = async function (knex) {
    return await knex.schema.dropTable('consulta');
  }
  