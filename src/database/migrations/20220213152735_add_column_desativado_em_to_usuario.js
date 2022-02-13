exports.up = function(knex) {
    return knex.schema.alterTable('usuario', function(table){
        table.timestamp('desativado_em')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('usuario', function(table){
        table.dropColumn('desativado_em')
    })
};
