
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('usuario').del()
    .then(function () {
      // Inserts seed entries
      return knex('usuario').insert([
        { nome: 'rowValue1', dt_nascimento: '2021-01-01', genero: 'masculino', email: 'bla@bla.com',senha: '123', created_at: null, updated_at: null, deleted_at: null },
        { nome: 'rowValue2', dt_nascimento: '2020-01-01', genero: 'feminino', email: 'bla2@bla.com',senha: '321', created_at: null, updated_at: null, deleted_at: null },
        { nome: 'rowValue3', dt_nascimento: '2019-01-01', genero: 'masculino', email: 'bla3@bla.com',senha: '246', created_at: null, updated_at: null, deleted_at: null }
      ]);
    });
};
