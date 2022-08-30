exports.up = function(knex) {
    return knex.schema.alterTable('consulta', function(table){
        table.date('data')
        table.time('hora')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('consulta', function(table){
        table.dropColumn('data')
        table.dropColumn('hora')
    })
};