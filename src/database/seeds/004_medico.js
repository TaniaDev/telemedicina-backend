
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('medico').del()
    .then(function () {
      // Inserts seed entries
      return knex('medico').insert([
        {
          id_usuario: 4,
          crm: "123456789",
          especialidade: "Dermatologista",
          created_at: null, 
          updated_at: null 
        },
        {
          id_usuario: 1,
          crm: "987654321",
          especialidade: "Oftalmologista",
          created_at: null, 
          updated_at: null 
        },
        {
          id_usuario: 2,
          crm: "741852963",
          especialidade: "Oncologista",
          created_at: null, 
          updated_at: null 
        },
        {
          id_usuario: 1,
          crm: "852963741",
          especialidade: "Infectologista",
          created_at: null, 
          updated_at: null 
        }
      ]);
    });
};
