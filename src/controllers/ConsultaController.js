const con = require('../database')

module.exports = {
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
const bcrypt = require('bcryptjs')

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

            //Verificar se a data é maior do que data atual
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
<<<<<<< HEAD
}
=======

}
>>>>>>> criar-consulta
