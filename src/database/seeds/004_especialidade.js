
exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('especialidade').del()
      .then(function () {
        // Inserts seed entries
        return knex('especialidade').insert([
          {
            id: "e2e8194a-877e-11ec-a8a3-0242ac120002",
            nome: "Dermatologista"
          },
          {
            id: "d5954e24-877f-11ec-a8a3-0242ac120002",
            nome: "Gastroenterologista"
          }
        ])
      })
  }