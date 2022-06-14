exports.up = function(knex) {
    return knex.schema.alterTable('disponibilidade_medica', function(table){
        table.uuid('id_dia_semana').references('dia_da_semana.id')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('disponibilidade_medica', function(table){
        table.dropColumn('id_dia_semana')
    })
};