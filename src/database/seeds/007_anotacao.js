
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('anotacao').del()
    .then(function () {
      // Inserts seed entries
      return knex('anotacao').insert([
        {
          id_paciente: "1165c5e3-de8a-43ea-b1e7-f4dc0dcca20b",
          descricao: "bla bla bla"
        },
      ])
    })
}
