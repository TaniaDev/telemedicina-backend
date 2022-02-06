exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('medico_especialidade').del()
      .then(function () {
        // Inserts seed entries
        return knex('medico_especialidade').insert([
          {
            id_medico: "b2406c78-dfb5-4010-a441-553f1e69d794",
            id_especialidade: "e2e8194a-877e-11ec-a8a3-0242ac120002"
          },
          {
            id_medico: "b2406c78-dfb5-4010-a441-553f1e69d794",
            id_especialidade: "d5954e24-877f-11ec-a8a3-0242ac120002"
          }
        ])
      })
  }
