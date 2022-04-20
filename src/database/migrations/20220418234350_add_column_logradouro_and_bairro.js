exports.up = function(knex) {
    return knex.schema.alterTable('endereco', function(table){
        table.text('logradouro')
        table.text('bairro')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('endereco', function(table){
        table.dropColumn('logradouro')
        table.dropColumn('bairro')
    })
};
