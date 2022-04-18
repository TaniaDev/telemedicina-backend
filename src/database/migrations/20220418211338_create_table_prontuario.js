exports.up = function(knex) {
    return knex.schema.createTable('prontuario', function(table){
        table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
        table.uuid('id_paciente').references('paciente.id_usuario').onDelete('CASCADE')
        table.uuid('id_medico').references('medico.id_usuario').notNullable().onDelete('CASCADE')
        table.timestamp('dt_hr_consulta').notNullable()
        table.text('doenca')
        table.text('motivo_consulta')
        table.integer('tempo_doente')
        table.text('sintoma')
        table.text('resumo')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('prontuario')
};