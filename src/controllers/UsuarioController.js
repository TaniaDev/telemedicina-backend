const con = require('../database/database')

module.exports = {
    index: async (req, res, next) => {
        try {
            const { id, page = 1 } = req.query;
            const query = await con('usuario')
            .limit(10)
            .offset((page - 1) * 10)
            .orderBy('id')

            const countObj = con('usuario').count()

            if (id) {
                query
                .where({ id })
                .select('usuario.email')
            }

            const [count] = await countObj
            res.header('X-Total-Count', count["count"])

            const results = await query

            return res.json(results);

        } catch (error) {
            next(error)
        }
    },
    read: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error('Id não identificado')
            }
            const [results] = await con('usuario')
                .where({ id: id })
                .select('usuario.nome',
                        'usuario.dt_nascimento',
                        'usuario.genero',
                        'usuario.email',
                        'usuario.senha')
                .limit(1)

            return res.json(results);

        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const { nome, dt_nascimento, genero, email, senha } = req.body
            await con('usuario').insert({
                nome, dt_nascimento, genero, email, senha
            })

            return res.status(201).json(usuario)

        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const { data } = req.body
            const { id } = req.params
            console.log(data)
            await con('usuario')
            .update(data)
            .where({ id })

            return res.send()

        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.params

            await con('usuario')
            .where({ id })
            .del()

            return res.send()
        } catch (error) {
            next(error)
        }
    }
}
