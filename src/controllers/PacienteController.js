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
    },
    getProntuario: async (req, res, next) => {
        try{
            // const authHeader = req.headers.authorization
            // const decode = jwt_decode(authHeader)
            // const id = decode.id

            // const {id_paciente} = req.params

            let id_paciente // = '4fb60da0-6a38-4b4a-8f92-551102702c7f'
            let result 

            if(!id_paciente){
                result = await con('prontuario')
            }else{
                console.log('passou id')
                result = await con('prontuario').where({id_paciente})
            }

            return res.status(200).json(result)
        }catch (error) {
            next(error)
        }
    },
    createProntuario: async (req, res, next) => {
        try{
            // const authHeader = req.headers.authorization
            // const decode = jwt_decode(authHeader)
            // const id = decode.id

            const {id_paciente, id_medico, dt_hr_consulta, doenca, motivo_consulta, tempo_doente, sintoma, resumo} = req.body

            await con('prontuario').insert({
                id_paciente, 
                id_medico, 	
                dt_hr_consulta,
                doenca, 
                motivo_consulta, 
                tempo_doente, 
                sintoma, 
                resumo
            })

            return res.status(200).json()
        }catch (error) {
            next(error)
        }
    },




}