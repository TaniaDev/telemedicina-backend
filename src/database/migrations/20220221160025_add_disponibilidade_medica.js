exports.up = async function (knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  
    return await knex.schema.createTable('disponibilidade_medica', table => {
        table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
        table.uuid('id_medico').references('medico.id_usuario').notNullable().onDelete('CASCADE')

        //0 - Dom | 1 - Seg | 2 - Ter | 3 - Qua | 4 - Qui | 6 - Sex | 7 - Sab
        //Um registro para cada dia da semana
        table.smallint('dia_da_semana').notNullable()
        table.text('horas').notNullable()
    })
  }
  
  exports.down = async function (knex) {
    return await knex.schema.dropTable('disponibilidade_medica')
  }