const jwt_decode = require('jwt-decode')
const con = require('../database')

module.exports = {
    createPaciente: async (req, res, next) => {
        try{
            const {id_usuario, peso, altura, alergia, doenca_cronica, vicio, medicamento} = req.body
            
            const userExists = await con('usuario').where({ id: id_usuario })
            
            if (userExists.length < 1) {
                return res.status(403).json({ error: 'Usuário não encontrado!'})
            }

            await con('paciente').insert({id_usuario, peso, altura, alergia, doenca_cronica, vicio, medicamento})
            
            return res.status(200).json({})
        } catch (error) {
            next(error)
        }
    },
    getPacienteById: async (req, res, next) => {
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
    },
    getPaciente: async (req, res, next) => {
        try{
            const {id_paciente} = req.params
            
            if(id_paciente == null){
                return res.status(404).json()
            }

            const [result] = await con('usuario').select('*').join('paciente', 'paciente.id_usuario', '=', 'usuario.id').where({'id_usuario': id_paciente})
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}