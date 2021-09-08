
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('anotacao').del()
    .then(function () {
      // Inserts seed entries
      return knex('anotacao').insert([
        {
          id_paciente: 2,
          dt_hr_anotacao: "2021-09-07T21:56:30",
          descricao: "bla bla bla",
          anexo: "",
          created_at: null, 
          updated_at: null 
        },
      ]);
    });
};
