exports.up = async function (knex) {
    return await knex.schema.createTable('documento_medico', table => {
        table.increments('id').primary();
        table.integer('id_paciente').references('paciente.id').notNullable().onDelete('CASCADE');
        table.text('tipo').notNullable();
        table.text('descricao').notNullable();
        table.timestamp('dt_hr_emissao').nullable();
        table.date('dt_validade').nullable();
        table.text('status').notNullable();

        table.timestamp('created_at').defaultTo(knex.fn.now()).nullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
    })
  }
  
  exports.down = async function (knex) {
    return await knex.schema.dropTable('documento_medico');
  }
  