
exports.up = async function(knex) {
    return await knex.schema.createTable('endereco', table => {
        table.uuid('id_usuario').primary().references('usuario.id').notNullable().onDelete('CASCADE')
        table.text('cep').notNullable()
        table.text('numero').notNullable()
        table.text('complemento')
        table.text('cidade').notNullable()
        table.text('estado').notNullable()
        
        table.timestamp('criado_em').defaultTo(knex.fn.now()).nullable()
        table.timestamp('atualizado_em').defaultTo(knex.fn.now()).nullable()
    })    
}

exports.down = async function (knex) {
    return await knex.schema.dropTable('endereco');
}
