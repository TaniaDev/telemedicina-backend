exports.up = function(knex) {
    return knex.schema.alterTable('usuario', function(table){
        table.text('resetToken')
        table.datetime('resetTokenExpires')
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('usuario', function(table){
        table.dropColumn('resetToken')
        table.dropColumn('resetTokenExpires')
    })
};
