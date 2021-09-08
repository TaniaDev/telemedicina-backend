
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('endereco').del()
    .then(function () {
      // Inserts seed entries
      return knex('endereco').insert([
        {
          id_usuario: 4,
          cep: "01245-888",
          logradouro: "Avenida Vergueiro",
          numero: "8",
          complemento: "...",
          bairro: "Ipiranga",
          cidade: "São Paulo",
          estado: "São Paulo",
          created_at: null, 
          updated_at: null 
        },
        {
          id_usuario: 1,
          cep: "74895-167",
          logradouro: "Avenida Vergueiro",
          numero: "67",
          complemento: "Viela 2",
          bairro: "Sacoma",
          cidade: "São Paulo",
          estado: "São Paulo",
          created_at: null, 
          updated_at: null 
        },
        {
          id_usuario: 3,
          cep: "74981-987",
          logradouro: "Avenida Belo Horizonte",
          numero: "7",
          complemento: "...",
          bairro: "Riacho 12",
          cidade: "Guaxupe",
          estado: "Minas Gerais",
          created_at: null, 
          updated_at: null 
        },
        {
          id_usuario: 2,
          cep: "79846214",
          logradouro: "Rua Amazonas",
          numero: "79A",
          complemento: "...",
          bairro: "Amsterdã",
          cidade: "Rio Branco",
          estado: "Acre",
          created_at: null, 
          updated_at: null 
        }
      ]);
    });
};
