exports.up = async function(knex) {
    return await knex.schema.createTable('admin', table => {
        table.increments('id').primary();
        table.integer('id_usuario').references('usuario.id').notNullable().onDelete('CASCADE');

        table.timestamp('created_at').defaultTo(knex.fn.now()).nullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
    })    
};

exports.down = async function (knex) {
    return await knex.schema.dropTable('admin');
};