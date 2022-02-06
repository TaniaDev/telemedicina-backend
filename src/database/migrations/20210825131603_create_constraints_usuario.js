const CONSTRAINTS = `
ALTER TABLE public.usuario ADD CONSTRAINT usuario_genero_check CHECK(genero IN ('H','M','O'));
ALTER TABLE public.usuario ADD CONSTRAINT usuario_tipo_check CHECK(tipo IN ('Admin','Paciente','Medico'));
`

const DROP_CONSTRAINTS = `
ALTER TABLE public.usuario DROP CONSTRAINT usuario_genero_check;
ALTER TABLE public.usuario DROP CONSTRAINT usuario_tipo_check;
`
exports.up = async function(knex) {
    return await knex.raw(CONSTRAINTS)
}

exports.down = async function(knex) {
    return await knex.raw(DROP_CONSTRAINTS)
}
