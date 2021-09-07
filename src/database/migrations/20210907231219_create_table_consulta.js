exports.up = async function (knex) {
    return await knex.schema.createTable('consulta', table => {
        table.increments('id').primary();
        table.integer('id_medico').references('medico.id').notNullable().onDelete('CASCADE');
        table.integer('id_paciente').references('paciente.id').notNullable().onDelete('CASCADE');
        table.text('status').notNullable();
        table.timestamp('dt_hr_consulta');
        table.timestamp('dt_hr_notificacao');
        table.text('frequencia_notificacao').notNullable();

        table.timestamp('created_at').defaultTo(knex.fn.now()).nullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
    })
  }
  
  exports.down = async function (knex) {
    return await knex.schema.dropTable('consulta');
  }
  