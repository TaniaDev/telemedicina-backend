
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('usuario').del()
    .then(function () {
      // Inserts seed entries
      return knex('usuario').insert([
        { nome: 'rowValue1' },
        { nome: 'rowValue2' },
        { nome: 'rowValue3' }
      ]);
    });
};
