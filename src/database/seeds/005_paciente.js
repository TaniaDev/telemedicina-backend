
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('paciente').del()
    .then(function () {
      // Inserts seed entries
      return knex('paciente').insert([
        {
          id_usuario: 4,
          peso: "65",
          altura: "1.65",
          alergia: "",
          doenca_cronica: "",
          vicio: "Cigarro",
          medicamento: "",
          created_at: null, 
          updated_at: null 
        },
        {
          id_usuario: 2,
          peso: "80",
          altura: "1.75",
          alergia: "",
          doenca_cronica: "",
          vicio: "",
          medicamento: "",
          created_at: null, 
          updated_at: null 
        },
      ]);
    });
};
