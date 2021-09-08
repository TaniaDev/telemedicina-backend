
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('admin').del()
    .then(function () {
      // Inserts seed entries
      return knex('admin').insert([
        {
          id_usuario: 1,
          created_at: null, 
          updated_at: null 
        },
      ]);
    });
};
