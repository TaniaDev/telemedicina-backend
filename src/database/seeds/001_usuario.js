
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('usuario').del()
    .then(function () {
      // Inserts seed entries
      return knex('usuario').insert([
        { nome: 'Joana Santana', dt_nascimento: '1985-01-01', genero: 'M', telefone: '(11) 2222-2222', endereco: 'Av Paulista, 100', email: 'joana@gmail.com',senha: '123', created_at: null, updated_at: null },
        { nome: 'Carlos da Silva', dt_nascimento: '1965-02-02', genero: 'H', telefone: '(11) 2222-2222', endereco: 'Rua Europa, 300',email: 'carlos@uol.com',senha: '321', created_at: null, updated_at: null },
        { nome: 'Karina Laranjeira', dt_nascimento: '1999-03-03', genero: 'M', telefone: '(11) 2222-2222', endereco: 'Rua Frei João, 50', email: 'karina@hotmail.com',senha: '246', created_at: null, updated_at: null },
        { nome: 'Ariel Silveira', dt_nascimento: '1995-03-03', genero: 'O', telefone: '(11) 2222-2222', endereco: 'Av Vergueiro, 500', email: 'ariel@gmail.com',senha: '135', created_at: null, updated_at: null }
      ]);
    });
};
