
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('medico').del()
    .then(function () {
      // Inserts seed entries
      return knex('medico').insert([
        {
          id_usuario: "b2406c78-dfb5-4010-a441-553f1e69d794",
          crm: "123456789"
        }
      ])
    })
}
