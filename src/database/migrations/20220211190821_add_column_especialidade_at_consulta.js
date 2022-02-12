
exports.up = function(knex) {
    return knex.schema.alterTable('consulta', function(table){
        table.uuid('id_especialidade')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('consulta', function(table){
        table.dropColumn('id_especialidade')
    })
};
