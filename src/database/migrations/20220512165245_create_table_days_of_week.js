exports.up = function(knex) {
    return knex.schema.createTable('dia_da_semana', function(table){
        table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
        table.smallint('dia')
        table.text('titulo').notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('dia_da_semana')
};