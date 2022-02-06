exports.up = async function(knex) {
    return await knex.schema.createTable('paciente', table => {
        table.uuid('id_usuario').primary().references('usuario.id').notNullable().onDelete('CASCADE')
        table.text('peso').notNullable()
        table.text('altura').notNullable()  
        table.text('alergia')
        table.text('doenca_cronica')
        table.text('vicio')
        table.text('medicamento')

        table.timestamp('criado_em').defaultTo(knex.fn.now()).nullable()
        table.timestamp('atualizado_em').defaultTo(knex.fn.now()).nullable()
    })    
}

exports.down = async function (knex) {
    return await knex.schema.dropTable('paciente');
}
