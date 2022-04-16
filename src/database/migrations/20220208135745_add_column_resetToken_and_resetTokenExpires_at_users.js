exports.up = function(knex) {
    return knex.schema.alterTable('usuario', function(table){
        table.text('token')
        table.datetime('token_expira_em')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('usuario', function(table){
        table.dropColumn('token')
        table.dropColumn('token_expira_em')
    })
};
