const bcrypt = require('bcryptjs')
const jwt_decode = require('jwt-decode')
const con = require('../database')

const Consulta = require('../model/Consulta')
const ConsultaDAO = require('../dao/ConsultaDAO')

const {startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear} = require('date-fns')
const consultaDAO = new ConsultaDAO()

module.exports = {
    criar: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_medico = decode.id

            const {
                dt_hr_consulta,
                id_especialidade
            } = req.body
            
            const consulta = new Consulta({
                id_medico,
                dt_hr_consulta,
                id_especialidade
            })

            await consultaDAO.criarConsulta(consulta)
            //Verificar se o médico já possui agendamento nesse dia e horário
            /*const jaExistente = await con('consulta').where({ id_medico, dt_hr_consulta }).select('id')

            if (jaExistente.length != 0) {
                return res.status(403).json({ error: 'A data para este médico já está reservada'})
            } else {}*/

            //const medico = await con('medico').where({id_usuario: id_medico})
            //if(!medico){
            //    return res.status(400).json({error: 'Médico não existe'})
            //}

            //Verificar se a data é maior do que data atual - Comparando valores incompativeis
            // const now = new Date()
            // if(dt_hr_consulta > now){
            //     return res.status(400).json({error: 'O horário da consulta deve ser maior que a hora atual'})
            // }
            
            // Verificar se o id_especialidade existe e se o médico atende essa especialidade
            //const especialidade = await con('especialidade').where({id: id_especialidade})
            //if(!especialidade){
            //    return res.status(400).json({error: 'Especialidade não existe'})
            //}

            //const medicoAtendeEspecialidade = await con('medico_especialidade').where({id_medico, id_especialidade})
            //if(!medicoAtendeEspecialidade){
            //    return res.status(400).json({error: 'Médico não atende essa especialidade'})
            //}

            

                return res.status(201).json({ msg: 'Consulta criada com sucesso!' })
            
        } catch (error) {
            next(error)
        }
    },
    agendar: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_usuario = decode.id

            const { id_consulta } = req.params

            await consultaDAO.agendarConsulta({
                id_consulta,
                id_usuario                
            })

            return res.status(200).json({ msg: 'Consulta agendada com sucesso! ' })

        } catch(error) {
            next(error)
        }
    },
    obterConsultas: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_usuario = decode.id
            const tipo_usuario = decode.tipo

            const consultas = await consultaDAO.obterConsultasPeloUsuario({ id_usuario, tipo_usuario })

            return res.status(200).json(consultas)
        }
        catch(error) {
            next(error)
        }

    },
    obterUmaConsultaPeloId: async (req, res, next) => {
        try {
            const { id_consulta } = req.params

            const consulta = await consultaDAO.obterUmaConsultaPeloId(id_consulta)

            return res.status(200).json(consulta)
        }
        catch (error) {
            next(error)
        }

    },
    cancelar: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_cancelador = decode.id
            
            const { id_consulta } = req.params
            
            await consultaDAO.cancelarConsulta({
                id_cancelador,
                id_consulta
            }) 

            /*if(!id_consulta){
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
            }*/

            return res.status(200).json({ msg: 'Consulta cancelada com sucesso. '})
        } catch (error) {
            next(error)
        }
    },
    atualizar: async(req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_medico = decode.id

            const { id_consulta } = req.params

            const {
                id_paciente,
                id_especialidade,
                dt_hr_consulta
            } = req.body

            const now = new Date()

            if(dt_hr_consulta <= now){ //Melhorar a formação do now
                return res.status(500).json({error: 'A nova data deve ser maior do que a data atual'})
            }
            
            //const result = await con('consulta').where({id: id_consulta})

            //if(result == ''){
            //    return res.status(500).json({error: 'Consulta não existe!'})
            //}

            //if(result[0].id_medico != id && result[0].id_paciente != id){
            //    return res.status(500).json({error: 'Somente o médico ou paciente podem alterar a data da consulta'})
            //}

            //Verificar se o médico está disponivel no novo horário
            
            await consultaDAO.atualizarConsulta({
                id_consulta,
                id_medico,
                id_paciente,
                id_especialidade,
                dt_hr_consulta
            })

            return res.status(200).json({ msg: 'Consulta atualizada com sucesso! '})
        } catch(error) {
            next(error)
        }
    },
    deletar: async (req, res, next) => {
        try {
            const { id } = req.params
    
            await con('consulta')
            .where({ id })
            .del()
    
            return res.send()
        } catch (error) {
            next(error)
        }
    },
    getTodayAppointments: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const appointments = await con('consulta').where({ id_medico: id }).orWhere({id_paciente: id }).andWhere('dt_hr_consulta', '>=', startOfDay(current)).andWhere('dt_hr_consulta', '<=', endOfDay(current))

            if(appointments == ''){
                return res.status(404).json({msg: 'Não há consultas hoje!'})
            }

            return res.status(200).json(appointments)
        }catch (error) {
            next(error)
        }
    },
    getWeekAppointments: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const appointments = await con('consulta').where({ id_medico: id }).orWhere({id_paciente: id }).andWhere('dt_hr_consulta', '>=', startOfWeek(current)).andWhere('dt_hr_consulta', '<=', endOfWeek(current))

            if(appointments == ''){
                return res.status(404).json({msg: 'Não há consultas essa semana!'})
            }

            return res.status(200).json(appointments)
        }catch (error) {
            next(error)
        }
    },
    getScheduledLateAppointments: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const appointments = await con('consulta').where({ id_medico: id }).orWhere({id_paciente: id }).andWhere('status', 'Agendado')

            if(appointments == ''){
                return res.status(404).json({msg: 'Não há consultas agendadas!'})
            }

            return res.status(200).json(appointments)
        }catch (error) {
            next(error)
        }
    },
    getCanceledLateAppointments: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const appointments = await con('consulta').where({ id_medico: id }).orWhere({id_paciente: id }).andWhere('status', 'Cancelado')

            if(appointments == ''){
                return res.status(404).json({msg: 'Não há consultas Canceladas!'})
            }

            return res.status(200).json(appointments)
        }catch (error) {
            next(error)
        }
    }
}