exports.up = async function(knex) {
    return await knex.schema.createTable('medico', table => {
        table.uuid('id_usuario').primary().references('usuario.id').notNullable().onDelete('CASCADE')
        table.text('crm').unique().notNullable()

        table.timestamp('criado_em').defaultTo(knex.fn.now()).nullable()
        table.timestamp('atualizado_em').defaultTo(knex.fn.now()).nullable()
    })    
}

exports.down = async function (knex) {
    return await knex.schema.dropTable('medico');
}
