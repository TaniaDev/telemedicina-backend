exports.up = async function(knex) {
    return await knex.schema.createTable('especialidade', table => {
        table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
        table.text('nome').notNullable()
        
        table.timestamp('criado_em').defaultTo(knex.fn.now()).nullable()
        table.timestamp('atualizado_em').defaultTo(knex.fn.now()).nullable()
    })    
}

exports.down = async function (knex) {
    return await knex.schema.dropTable('especialidade');
}
