exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('usuario').del()
    .then(function () {
      // Inserts seed entries
      return knex('usuario').insert([
        { id: "a8d930ff-792b-45ad-9362-eb095f59fc58", nome: 'Joana Santana', dt_nascimento: '1985-01-01', genero: 'M', telefone: '551122222222', email: 'joana@gmail.com', senha: '123', tipo: 'Admin' },
        { id: "5f8486da-561b-4454-8fda-6cd924ff58d8", nome: 'Carlos da Silva', dt_nascimento: '1965-02-02', genero: 'H', telefone: '551122222222', email: 'carlos@uol.com', senha: '321', tipo: 'Paciente' },
        { id: "b2406c78-dfb5-4010-a441-553f1e69d794", nome: 'Karina Laranjeira', dt_nascimento: '1999-03-03', genero: 'M', telefone: '551122222222', email: 'karina@hotmail.com', senha: '246', tipo: 'Medico' },
        { id: "1165c5e3-de8a-43ea-b1e7-f4dc0dcca20b", nome: 'Ariel Silveira', dt_nascimento: '1995-03-03', genero: 'O', telefone: '551122222222', email: 'ariel@gmail.com', senha: '135', tipo: 'Paciente' }
      ]);
    });
};
