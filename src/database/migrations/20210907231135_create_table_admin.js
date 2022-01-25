exports.up = async function(knex) {
    return await knex.schema.createTable('admin', table => {
        table.increments('id').primary();
        table.integer('id_usuario').references('usuario.id').notNullable().onDelete('CASCADE');

    })    
};

exports.down = async function (knex) {
    return await knex.schema.dropTable('admin');
};