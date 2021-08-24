exports.up = async function (knex) {
  return await knex.schema.alterTable('usuario', table => {
      table.timestamp('deleted_at')
  })
}
exports.down = async function (knex) {
  return await knex.schema.alterTable('usuario', table => {
    table.dropColumn('deleted_at')
  });
}
