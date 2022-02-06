
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('consulta').del()
    .then(function () {
      // Inserts seed entries
      return knex('consulta').insert([
        {
          id_medico: "b2406c78-dfb5-4010-a441-553f1e69d794",
          id_paciente: "1165c5e3-de8a-43ea-b1e7-f4dc0dcca20b",
          status: "Agendado",
          dt_hr_consulta: "2021-09-07T08:30:00"
        },
        {
          id_medico: "b2406c78-dfb5-4010-a441-553f1e69d794",
          id_paciente: "5f8486da-561b-4454-8fda-6cd924ff58d8",
          status: "Cancelado",
          dt_hr_consulta: "2021-09-07T13:00:00"
        }
      ])
    })
}
