const con = require('../database/database')

module.exports = {
    index: async (req, res, next) => {
        try {
            const { id, page = 1 } = req.query;
            const query = await con('usuario')
            .limit(1)
            .offset((page - 1) * 5)

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
    create: async (req, res, next) => {
        try {
            const { email, senha } = req.body
            await con('usuario').insert({
                email, senha
            })

            return res.status(201).json(usuario)

        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const { email } = req.body
            const { id } = req.params

            await con('usuario')
            .update({ email })
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
