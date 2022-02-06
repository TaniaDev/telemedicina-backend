exports.up = async function(knex) {
    return await knex.schema.createTable('admin', table => {
        table.uuid('id_usuario').primary().references('usuario.id').notNullable().onDelete('CASCADE')

        table.timestamp('criado_em').defaultTo(knex.fn.now()).nullable()
        table.timestamp('atualizado_em').defaultTo(knex.fn.now()).nullable()
    })    
}

exports.down = async function (knex) {
    return await knex.schema.dropTable('admin');
}
