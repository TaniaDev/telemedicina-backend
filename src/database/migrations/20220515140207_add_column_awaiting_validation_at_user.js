exports.up = function(knex) {
    return knex.schema.alterTable('usuario', function(table){
        table.integer('aguardando_validacao')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('usuario', function(table){
        table.dropColumn('aguardando_validacao')
    }) 
};