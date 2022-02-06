
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('admin').del()
    .then(function () {
      // Inserts seed entries
      return knex('admin').insert([
        {
          id_usuario: "a8d930ff-792b-45ad-9362-eb095f59fc58"
        },
      ])
    })
}
