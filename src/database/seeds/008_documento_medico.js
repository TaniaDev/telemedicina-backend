
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('documento_medico').del()
    .then(function () {
      // Inserts seed entries
      return knex('documento_medico').insert([
        {
          id_paciente: 1,
          tipo: "Exame de sangue",
          descricao: "Exame completo de sangue",
          dt_hr_emissao: "2021-09-07T21:56:30",
          dt_validade: "2021-09-07",
          status: "8",
          created_at: null, 
          updated_at: null
        }
      ]);
    });
};
