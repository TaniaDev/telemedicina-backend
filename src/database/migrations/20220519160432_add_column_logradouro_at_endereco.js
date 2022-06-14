exports.up = function(knex) {
    return knex.schema.alterTable('endereco', function(table){
        table.text('logradouro')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('endereco', function(table){
        table.dropColumn('logradouro')
    })
};