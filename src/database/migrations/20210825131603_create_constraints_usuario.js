const CONSTRAINTS = `
ALTER TABLE public.usuario ADD CONSTRAINT usuario_genero_check CHECK(genero IN ('H','M','O'));
`

const DROP_CONSTRAINTS = `
ALTER TABLE public.usuario DROP CONSTRAINT usuario_genero_check;
`
exports.up = async function(knex) {
    return await knex.raw(CONSTRAINTS)
}

exports.down = async function(knex) {
    return await knex.raw(DROP_CONSTRAINTS)
}

