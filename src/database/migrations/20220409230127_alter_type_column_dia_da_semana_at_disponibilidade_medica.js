exports.up = function(knex) {
    return knex.schema.alterTable('disponibilidade_medica', function(table){
        table.dropColumn('dia_da_semana')
        table.string('dia_semana')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('disponibilidade_medica', function(table){
        table.dropColumn('dia_da_semana')
    })
};