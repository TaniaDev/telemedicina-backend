const knex = require('../database/database')

module.exports = {
    async index(req, res) {
        const result = await knex('usuario')

        return res.json(result);
    },
    async create(req, res, next) {
        try {
            const { nome } = req.body
            await knex('usuario').insert({
                nome
            })

            return res.status(201).send()
        } catch (error) {
            next(error)
        }
    },
    async update(req, res, next) {
        try {
            const { nome } = req.body
            const { id } = req.params

            await knex('usuario')
            .update({ nome })
            .where({ id })

            return res.send()
        } catch (error) {
            next(error)
        }
    },
    async delete(req, res, next) {
        try {
            const { id } = req.params

            await knex('usuario')
            .where({ id })

            return res.send()
        } catch (error) {
            next(error)
        }
    }
}