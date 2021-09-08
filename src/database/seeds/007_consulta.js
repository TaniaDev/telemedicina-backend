
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('consulta').del()
    .then(function () {
      // Inserts seed entries
      return knex('consulta').insert([
        {
          id_medico: 4,
          id_paciente: 1,
          status: "Agendado",
          dt_hr_consulta: "2021-09-07T21:56:30",
          dt_hr_notificacao: "2021-09-07T21:56:30",
          created_at: null, 
          updated_at: null 
        },
        {
          id_medico: 1,
          id_paciente: 2,
          status: "Cancelado",
          dt_hr_consulta: "2021-09-07T21:56:30",
          dt_hr_notificacao: "2021-09-07T21:56:30",
          frequencia_notificacao: "10",
          created_at: null, 
          updated_at: null 
        }
      ]);
    });
};
