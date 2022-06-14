exports.up = function(knex) {
    return knex.schema.alterTable('consulta', function(table){
        table.text('url_consulta')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('consulta', function(table){
        table.dropColumn('url_consulta')
    })
};