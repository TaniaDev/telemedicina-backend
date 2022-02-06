
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('endereco').del()
    .then(function () {
      // Inserts seed entries
      return knex('endereco').insert([
        {
          id_usuario: "1165c5e3-de8a-43ea-b1e7-f4dc0dcca20b",
          cep: "01245-888",
          numero: "8",
          cidade: "São Paulo",
          estado: "São Paulo"
        },
        {
          id_usuario: "a8d930ff-792b-45ad-9362-eb095f59fc58",
          cep: "74895-167",
          numero: "67",
          complemento: "Viela 2",
          cidade: "São Paulo",
          estado: "São Paulo"
        },
        {
          id_usuario: "b2406c78-dfb5-4010-a441-553f1e69d794",
          cep: "74981-987",
          numero: "7",
          cidade: "Guaxupe",
          estado: "Minas Gerais"
        },
        {
          id_usuario: "5f8486da-561b-4454-8fda-6cd924ff58d8",
          cep: "79846214",
          numero: "79A",
          cidade: "Rio Branco",
          estado: "Acre"
        }
      ])
    })
}
