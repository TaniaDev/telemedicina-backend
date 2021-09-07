
exports.up = async function(knex) {
    return await knex.schema.createTable('endereco', table => {
        table.increments('id').primary();
        table.integer('id_usuario').references('usuario.id').notNullable().onDelete('CASCADE');
        table.text('cep').notNullable();
        table.text('logradouro').notNullable();
        table.text('numero').notNullable();
        table.text('completo');
        table.text('bairro').notNullable();
        table.text('cidade').notNullable();
        table.text('estado').notNullable();
        
        table.timestamp('created_at').defaultTo(knex.fn.now()).nullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
    })    
};

exports.down = async function (knex) {
    return await knex.schema.dropTable('endereco');
};