const bcrypt = require('bcryptjs')
const jwt_decode = require('jwt-decode')
const con = require('../database')
const {endOfDay, startOfWeek, endOfWeek, sub} = require('date-fns')
const dayjs = require('dayjs')

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

            // Pegando horas ocupadas / com consultas agendadas
            const consultas = await con('consulta').where({id_medico, data, status: 'Agendado'})
            let horasDisponiveis = []
            let horasOcupadas = []
            let aux = ''

            consultas.forEach(consulta => {
                horasOcupadas.push(consulta.hora)
            })

            // Pegando todos os registros de horas do médico
            const result = await con('disponibilidade_medica').select('horas', 'dia_da_semana.dia')
                                .join('dia_da_semana', 'dia_da_semana.id', '=', 'disponibilidade_medica.id_dia_semana')
                                .where({id_medico})

            result.forEach(item => {
                aux = `${item.horas}:00:00`
                horasDisponiveis.push(aux)
            })

            // Descontando as horas ocupadas
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

            const {horas, dia_selecionado} = req.body

            // horas - 1 insert p cada hora
            // dia_semana - Transformar numa string separada por virgula (sem espaço)
            const [result] = await con('dia_da_semana').select('id').where({dia: dia_selecionado})
            let id_dia = result.id
            await con('disponibilidade_medica').insert({ id_medico, horas, id_dia_semana: id_dia })
            return res.status(200).json()
        }catch(error){
            next(error)
        }
    },
    cleanRecords: async(req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_medico = decode.id

            await con('disponibilidade_medica').where({id_medico}).del()
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

            const result = await con('disponibilidade_medica').select('horas', 'dia_da_semana.dia')
                                .join('dia_da_semana', 'dia_da_semana.id', '=', 'disponibilidade_medica.id_dia_semana')
                                .where({id_medico}).orderBy('horas')
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

            let current = new Date();
            let limit = sub(current, {hours: 1})

            let verify = await con('consulta').select('id_medico').where({id_medico: id})

            let appointments
            if(verify == ''){
                appointments = await con('consulta').where({ id_paciente: id }).andWhere('dt_hr_consulta', '>', limit).andWhere('status', 'Agendado')
            }else{
                appointments = await con('consulta').where({ id_medico: id }).andWhere('dt_hr_consulta', '>', limit).andWhere('status', 'Agendado')
            }
            
            appointments.dt_hr_consulta = "2000-05-02T23:10:00.000Z"
            
            return res.status(200).json(appointments)
        }catch (error) {
            next(error)
        }
    },
    getPatientAppointments: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_paciente = decode.id

            appointments = await con('consulta').select('consulta.dt_hr_consulta', 'consulta.status', 'usuario.nome as medico', 'especialidade.nome as especialidade')
                                    .join('usuario', 'usuario.id', '=', 'consulta.id_medico') 
                                    .join('especialidade', 'especialidade.id', '=', 'consulta.id_especialidade') 
                                    .where({ 'consulta.id_paciente': id_paciente })
                                    .orderBy('consulta.dt_hr_consulta', 'desc')
    
            return res.status(200).json(appointments)
        }catch (error) {
            next(error)
        }
    },
    getDoctorAppointments: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_medico = decode.id

            appointments = await con('consulta').select('consulta.dt_hr_consulta', 'consulta.status', 'usuario.nome as paciente', 'especialidade.nome as especialidade')
                                    .join('usuario', 'usuario.id', '=', 'consulta.id_paciente') 
                                    .join('especialidade', 'especialidade.id', '=', 'consulta.id_especialidade') 
                                    .where({ 'consulta.id_medico': id_medico })
                                    .orderBy('consulta.dt_hr_consulta', 'desc')
    
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

            let current = new Date();
            let limit = sub(current, {hours: 1})

            let verify = await con('consulta').select('id_medico').where({id_medico: id})

            let appointments
            if(verify == ''){
                appointments = await con('consulta').where({ id_paciente: id }).andWhere('dt_hr_consulta', '>', limit).andWhere('dt_hr_consulta', '<=', endOfDay(current)).andWhere('status', 'Agendado')
            }else{
                appointments = await con('consulta').where({ id_medico: id }).andWhere('dt_hr_consulta', '>', limit).andWhere('dt_hr_consulta', '<=', endOfDay(current)).andWhere('status', 'Agendado')
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

            let current = new Date();
            let limit = sub(current, {hours: 1})

            let verify = await con('consulta').select('id_medico').where({id_medico: id})

            let appointments
            if(verify == ''){
                appointments = await con('consulta')
                                        .where({ id_paciente: id })
                                        .andWhere('dt_hr_consulta', '>=', startOfWeek(current))
                                        .andWhere('dt_hr_consulta', '<=', endOfWeek(current))
                                        .andWhere('dt_hr_consulta', '>', limit)
                                        .andWhere('status', 'Agendado')
            }else{
                appointments = await con('consulta')
                                        .where({ id_medico: id })
                                        .andWhere('dt_hr_consulta', '>=', startOfWeek(current))
                                        .andWhere('dt_hr_consulta', '<=', endOfWeek(current))
                                        .andWhere('dt_hr_consulta', '>', limit)
                                        .andWhere('status', 'Agendado')
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

            let current = new Date();
            let limit = sub(current, {hours: 1})
            
            let verify = await con('consulta').select('id_medico').where({id_medico: id})

            let appointments
            if(verify == ''){
                appointments = await con('consulta').where({ id_paciente: id }).andWhere('status', 'Agendado').andWhere('dt_hr_consulta', '>', limit)
            }else{
                appointments = await con('consulta').where({ id_medico: id }).andWhere('status', 'Agendado').andWhere('dt_hr_consulta', '>', limit)
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

            let current = new Date();
            let limit = sub(current, {hours: 1})

            let verify = await con('consulta').select('id_medico').where({id_medico: id})
            
            let appointments
            if(verify == ''){
                appointments = await con('consulta').where({ id_paciente: id }).andWhere('status', 'Cancelado').andWhere('dt_hr_consulta', '>', limit)
            }else{
                appointments = await con('consulta').where({ id_medico: id }).andWhere('status', 'Cancelado').andWhere('dt_hr_consulta', '>', limit)
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
    },
    getDiasDaSemana: async (req, res, next) => {
        try {
            const results = await con('dia_da_semana')
            return res.status(200).json(results)
        }
        catch (error) {
            next(error)
        }

    },
    lateAppointments: async (req, res, next) => {
        let oneLessHour = dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:00')

        const results = await con('consulta').where({status: 'Agendado'}).andWhere('dt_hr_consulta', '<', oneLessHour)
        results.map(async (result) => {
            await con('consulta').update({status: "Não Realizada"}).where({id: result.id})
        })
        return
    },
    done: async (req, res, next) => {
        try{
            await con('consulta').update({status: "Realizada"}).where({id: req.params.id})
            return res.status(200).json()
        }catch(error){
            next(error)
        }
    }


}