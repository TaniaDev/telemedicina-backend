const bcrypt = require('bcryptjs')
const jwt_decode = require('jwt-decode')
const con = require('../database')

module.exports = {
    create: async (req, res, next) => {
        try {
            const {id_medico, id_paciente, status, dt_hr_consulta, id_especialidade} = req.body

            //Verificar se o médico existe
            const medico = await con('medico').where({id_usuario: id_medico})
            if(!medico){
                return res.status(400).json({error: 'Médico não existe'})
            }

            //Verificar se o paciente existe
            const paciente = await con('paciente').where({id_usuario: id_paciente})
            if(!paciente){
                return res.status(400).json({error: 'Paciente não existe'})
            }

            //Verificar se a data é maior do que data atual - Comparando valores incompativeis
            const now = new Date()
            if(dt_hr_consulta > now){
                return res.status(400).json({error: 'O horário da consulta deve ser maior que a hora atual'})
            }
            
            //Verificar se o id_especialidade existe e se o médico atende essa especialidade
                // const especialidade = await con('especialidade').where({id: id_especialidade})
                // if(!especialidade){
                //     return res.status(400).json({error: 'Especialidade não existe'})
                // }

            //Verificar se o médico atende nesse dia e horário

            //Verificar se o médico já possui agendamento nesse dia e horário
            
            const consulta = await con('consulta').insert({id_medico, id_paciente, status, dt_hr_consulta, id_especialidade})
            return res.status(201).json(consulta)

        } catch (error) {
            next(error)
        }
    },
    cancel: async (req, res, next) => {
        try{
            const { id_consulta, id_cancelador } = req.body

            if(!id_consulta){
                return res.status(400).json({error: 'Informe o id da consulta'})
            }

            if(!id_cancelador){
                return res.status(400).json({error: 'Informe o id do usuário'})
            }

            const consulta = await con('consulta').where({id: id_consulta})
            
          
            if(!consulta[0].id){
                return res.status(400).json({error: 'Consulta não existe'})
            }

            if((consulta[0].id_medico != id_cancelador) && (consulta[0].id_paciente != id_cancelador)){
                return res.status(400).json({error: 'Somente o paciente ou médico podem cancelar a consulta'})
            }
            
            const now = new Date()
            await con('consulta')
                .update({
                    status: "cancelado", 
                    dt_hr_consulta: null, 
                    atualizado_em: now, 
                    cancelado_em: now, 
                    cancelado_por: id_cancelador})
                .where({id: id_consulta})

            return res.status(200).json()
        }catch (error) {
            next(error)
        }
    },
    changeDate: async(req, res, next) => {
        try{
            const {id_consulta, new_date} = req.body

            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const now = new Date()

            if(new_date <= now){ //Melgorar a formação do now
                return res.status(500).json({error: 'A nova data deve ser maior do que a data atual'})
            }
            
            const result = await con('consulta').where({id: id_consulta})

            if(result == ''){
                return res.status(500).json({error: 'Consulta não existe!'})
            }

            if(result[0].id_medico != id && result[0].id_paciente != id){
                return res.status(500).json({error: 'Somente o médico ou paciente podem alterar a data da consulta'})
            }
            
            await con('consulta').update({dt_hr_consulta: new_date, atualizado_em: now}).where({id: id_consulta})

            return res.status(200).json()
        }catch (error) {
            next(error)
        }
    },
    getMyAppointments: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const appointments = await con('consulta').where({ id_medico: id }).orWhere({id_paciente: id })

            if(appointments == ''){
                return res.status(404).json({msg: 'Não há consulas cadastradas!'})
            }

            return res.status(200).json({appointments})
        }catch (error) {
            next(error)
        }
    },

}