const con = require('../database');

module.exports = {
    index: async (req, res, next) => {
        try {
            const { id, page = 1 } = req.query
            const query = await con('usuario').where({'desativado_em': null})
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
    getAppointments: async (req, res, next) => {
        try {
            const { id } = req.params
            const query = await con('consulta').where({ id_medico: id }).orWhere({id_paciente: id })
            .orderBy('dt_hr_consulta')

            const results = await query

            const others = await con('usuario').select('nome','tipo').where({ id })

            return res.json({results, others})
        }catch (error) {
            next(error)
        }
    }
}