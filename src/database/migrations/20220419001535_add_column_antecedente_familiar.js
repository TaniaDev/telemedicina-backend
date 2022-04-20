exports.up = function(knex) {
    return knex.schema.alterTable('paciente', function(table){
        table.text('antecedente_familiar')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('paciente', function(table){
        table.dropColumn('antecedente_familiar')
    })
};
