exports.up = async function (knex) {
    return await knex.schema.createTable('anotacao', table => {
        table.increments('id').primary();
        table.integer('id_paciente').references('paciente.id').notNullable().onDelete('CASCADE');
        table.timestamp('dt_hr_anotacao').nullable();
        table.text('descricao').notNullable();
        table.text('anexo');

        table.timestamp('created_at').defaultTo(knex.fn.now()).nullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
    })
  }
  
  exports.down = async function (knex) {
    return await knex.schema.dropTable('anotacao');
  }
  