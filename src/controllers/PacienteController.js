const jwt_decode = require('jwt-decode')
const con = require('../database')

module.exports = {
    getPaciente: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const [result] = await con('paciente').where({id_usuario: id})
            
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },
    updatePaciente: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const {peso, altura, alergia, doenca_cronica, vicio, medicamento} = req.body

            await con('paciente').update({peso, altura, alergia, doenca_cronica, vicio, medicamento}).where({id_usuario: id})
            return res.status(200).json()
        }catch (error) {
            next(error)
        }
    }




}