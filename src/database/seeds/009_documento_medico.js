
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('documento_medico').del()
    .then(function () {
      // Inserts seed entries
      return knex('documento_medico').insert([
        {
          id_paciente: "1165c5e3-de8a-43ea-b1e7-f4dc0dcca20b",
          descricao: "Exame completo de sangue",
          adicionado_em: "2021-09-07T21:56:30",
          atualizado_em: "2021-09-07T21:56:30"
        }
      ])
    })
}
