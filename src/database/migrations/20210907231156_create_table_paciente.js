exports.up = async function(knex) {
    return await knex.schema.createTable('paciente', table => {
        table.increments('id').primary();
        table.integer('id_usuario').references('usuario.id').notNullable().onDelete('CASCADE');
        table.text('peso').notNullable();
        table.text('altura').notNullable();    
        table.text('alergia');
        table.text('doenca_cronica');
        table.text('vicio');
        table.text('medico');

        table.timestamp('created_at').defaultTo(knex.fn.now()).nullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
    })    
};

exports.down = async function (knex) {
    return await knex.schema.dropTable('paciente');
};