const jwt_decode = require('jwt-decode')
const PacienteDAO = require('../dao/PacienteDAO')
const Paciente = require('../model/Paciente')
const con = require('../database')

module.exports = {
    getPaciente: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            dao = new PacienteDAO()

            const [result] = dao.obter(new Paciente(id))
            
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