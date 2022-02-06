
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('paciente').del()
    .then(function () {
      // Inserts seed entries
      return knex('paciente').insert([
        {
          id_usuario: "1165c5e3-de8a-43ea-b1e7-f4dc0dcca20b",
          peso: "65",
          altura: "1.65",
          alergia: "",
          doenca_cronica: "",
          vicio: "",
          medicamento: ""
        },
        {
          id_usuario: "5f8486da-561b-4454-8fda-6cd924ff58d8",
          peso: "80",
          altura: "1.75",
          alergia: "",
          doenca_cronica: "",
          vicio: "Cigarro",
          medicamento: "" 
        },
      ])
    })
}
