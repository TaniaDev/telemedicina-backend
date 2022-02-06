exports.up = async function(knex) {
    return await knex.schema.createTable('medico_especialidade', table => {
        table.uuid('id_medico').references('medico.id_usuario').notNullable().onDelete('CASCADE')
        table.uuid('id_especialidade').references('especialidade.id').notNullable().onDelete('CASCADE')
    })    
}

exports.down = async function (knex) {
    return await knex.schema.dropTable('medico_especialidade');
}
