const jwt_decode = require('jwt-decode')
const con = require('../database')


module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const decode = jwt_decode(authHeader)
    const {id} = decode
    const {dt_hr_consulta} = req.body

    const results = await con('consulta')
                                .where({status: 'Agendado'})
                                .andWhere({id_paciente: id})
                                .andWhere({dt_hr_consulta})

    if(results.length > 0) {
        return res.status(400).json({ error: 'Já existe uma consulta nesse dia e hora' })
    }

    next()
}