const bcrypt = require('bcryptjs')
const jwt_decode = require('jwt-decode')
const con = require('../database')
const {startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear} = require('date-fns')
const current = new Date();

module.exports = {
    agendarconsulta: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_paciente = decode.id

            const { id_medico, id_especialidade, data, hora, dt_hr_consulta, url_consulta } = req.body

            const now = new Date()
            const result = await con('consulta').insert({
                                                            id_medico, 
                                                            id_paciente, 
                                                            status: 'Agendado',  
                                                            criado_em: now, 
                                                            id_especialidade, 
                                                            data, 
                                                            hora,
                                                            dt_hr_consulta,
                                                            url_consulta
                                                        })

            return res.status(200).json(result)
        }catch (error) {
            next(error)
        }
    },
    horasdisponiveismedico: async(req, res, next) => {
        try{
            const {id_medico, data} = req.params

            const consultas = await con('consulta').where({id_medico, data, status: 'Agendado'})
            let horasDisponiveis = []
            let horasOcupadas = []
            let aux = ''

            consultas.forEach(consulta => {
                horasOcupadas.push(consulta.hora)
            })

            const result = await con('disponibilidade_medica').select('horas' ,'dia_semana').where({id_medico})

            result.forEach(item => {
                aux = `${item.horas}:00:00`
                horasDisponiveis.push(aux)
            })

            horasDisponiveis = horasDisponiveis.filter(item => !horasOcupadas.includes(item))

            var hrJson = {"horas": horasDisponiveis, "dia_semana": result[0].dia_semana}            

            return res.status(200).json(hrJson)
        }catch (error) {
            next(error)
        }
    },
    definirDisponibilidadeMedica: async(req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_medico = decode.id

            const {horas, dia_semana} = req.body

            // horas - 1 insert p cada hora
            // dia_semana - Transformar numa string separada por virgula (sem espaço)
            await con('disponibilidade_medica').insert({ id_medico, horas, dia_semana })
            return res.status(200).json()
        }catch(error){
            next(error)
        }
    },
    getDisponibilidadeMedica: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_medico = decode.id

            const result = await con('disponibilidade_medica').select('horas', 'dia_semana').where({id_medico}).orderBy('horas')
            return res.status(200).json(result)
        }catch(error){
            next(error)
        }
    },
    agendar: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_usuario = decode.id

            const { id_consulta } = req.params

            const now = new Date()

            const consulta = await con('consulta').where({ id: id_consulta }).update({ id_paciente: id_usuario, status: "Agendado", atualizado_em: now, atualizado_por: id_usuario })
            return res.status(200).json(consulta)

        } catch (error) {
            next(error)
        }
    },
    getConsultasDisponiveis: async (req, res, next) => {
        try {
            //const { id_especialidade } = req.body

            const results = await con('consulta').select('*').where({status: 'Livre'})

            return res.status(200).json(results)
        }
        catch (error) {
            next(error)
        }

    },
    create: async (req, res, next) => {
        try {
            const { id_medico, data, hora, dt_hr_consulta, id_especialidade } = req.body
            
            //Verificar se o médico já possui agendamento nesse dia e horário
            /*const jaExistente = await con('consulta').where({ id_medico, dt_hr_consulta }).select('id')

            if (jaExistente.length != 0) {
                return res.status(403).json({ error: 'A data para este médico já está reservada'})
            } else {}*/

            const medico = await con('medico').where({id_usuario: id_medico})
            if(!medico){
                return res.status(400).json({error: 'Médico não existe'})
            }

            //Verificar se a data é maior do que data atual - Comparando valores incompativeis
            // const now = new Date()
            // if(dt_hr_consulta > now){
            //     return res.status(400).json({error: 'O horário da consulta deve ser maior que a hora atual'})
            // }
            
            // Verificar se o id_especialidade existe e se o médico atende essa especialidade
            const especialidade = await con('especialidade').where({id: id_especialidade})
            if(!especialidade){
                return res.status(400).json({error: 'Especialidade não existe'})
            }

            const medicoAtendeEspecialidade = await con('medico_especialidade').where({id_medico, id_especialidade})
            if(!medicoAtendeEspecialidade){
                return res.status(400).json({error: 'Médico não atende essa especialidade'})
            }

                const consulta = await con('consulta').insert({ id_medico, dt_hr_consulta, id_especialidade, status: 'Livre' }).returning('id')

                return res.status(201).json(consulta)
            
        } catch (error) {
            next(error)
        }
    },
    cancel: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_cancelador = decode.id

            const { id_consulta } = req.params

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

            /*if((consulta[0].id_medico != id_cancelador) && (consulta[0].id_paciente != id_cancelador)){
                return res.status(400).json({error: 'Somente o paciente ou médico podem cancelar a consulta'})
            }*/
            
            const now = new Date()
            await con('consulta')
                .update({
                    status: "Cancelado", 
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

            if(new_date <= now){ //Melhorar a formação do now
                return res.status(500).json({error: 'A nova data deve ser maior do que a data atual'})
            }
            
            const result = await con('consulta').where({id: id_consulta})

            if(result == ''){
                return res.status(500).json({error: 'Consulta não existe!'})
            }

            //if(result[0].id_medico != id && result[0].id_paciente != id){
            //    return res.status(500).json({error: 'Somente o médico ou paciente podem alterar a data da consulta'})
            //}

            //Verificar se o médico está disponivel no novo horário
            
            await con('consulta').update({dt_hr_consulta: new_date, atualizado_em: now}).where({id: id_consulta})
            const dateUpdated = await con('consulta').where({id: id_consulta})


            return res.status(200).json(dateUpdated)
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
            
            return res.status(200).json(appointments)
        }catch (error) {
            next(error)
        }
    },
    getTodayAppointments: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            let verify = await con('consulta').select('id_medico').where({id_medico: id})

            let appointments
            if(verify == ''){
                appointments = await con('consulta').where({ id_paciente: id }).andWhere('dt_hr_consulta', '>=', startOfDay(current)).andWhere('dt_hr_consulta', '<=', endOfDay(current))
            }else{
                appointments = await con('consulta').where({ id_medico: id }).andWhere('dt_hr_consulta', '>=', startOfDay(current)).andWhere('dt_hr_consulta', '<=', endOfDay(current))
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

            let verify = await con('consulta').select('id_medico').where({id_medico: id})

            let appointments
            if(verify == ''){
                appointments = await con('consulta').where({ id_paciente: id }).andWhere('dt_hr_consulta', '>=', startOfWeek(current)).andWhere('dt_hr_consulta', '<=', endOfWeek(current))
            }else{
                appointments = await con('consulta').where({ id_medico: id }).andWhere('dt_hr_consulta', '>=', startOfWeek(current)).andWhere('dt_hr_consulta', '<=', endOfWeek(current))
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
            
            let verify = await con('consulta').select('id_medico').where({id_medico: id})

            let appointments
            if(verify == ''){
                appointments = await con('consulta').where({ id_paciente: id }).andWhere('status', 'Agendado')
            }else{
                appointments = await con('consulta').where({ id_medico: id }).andWhere('status', 'Agendado')
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

            let verify = await con('consulta').select('id_medico').where({id_medico: id})
            
            let appointments
            if(verify == ''){
                appointments = await con('consulta').where({ id_paciente: id }).andWhere('status', 'Cancelado')
            }else{
                appointments = await con('consulta').where({ id_medico: id }).andWhere('status', 'Cancelado')
            }
            
            return res.status(200).json(appointments)
        }catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
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
    getAppointment: async (req, res, next) => {
        try{
            const { id } = req.params

            const appointment = await con('consulta').where({ id })

            if(appointment == ''){
                return res.status(404).json({msg: 'Não há consulta com este ID'})
            }

            return res.status(200).json(appointment)
        }catch (error) {
            next(error)
        }
    }


}