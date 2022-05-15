const jwt_decode = require('jwt-decode')
const con = require('../database')

const Consulta = require('../model/Consulta')
const ConsultaDAO = require('../dao/ConsultaDAO')
const EspecialidadeDAO = require('../dao/EspecialidadeDAO')

const {startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear} = require('date-fns')
const consultaDAO = new ConsultaDAO()
const especialidadeDAO = new EspecialidadeDAO()

module.exports = {
    criar: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_usuario = decode.id

            const {
                id_medico_admin,
                dt_hr_consulta,
                id_especialidade
            } = req.body

            let id_medico
            let modificado_por

            if (decode.tipo === 'Medico') {
                id_medico = modificado_por = id_usuario
            } else if (decode.tipo === 'Admin') {
                id_medico = id_medico_admin
                modificado_por = id_usuario
            }

            const consulta = new Consulta({
                id_medico,
                dt_hr_consulta,
                id_especialidade,
                modificado_por
            })

            //Verifica se o horário selecionado já está sendo usado para o médico selecionado
            const consultaExistente = await consultaDAO.verificarDataHorarioExistente({ id_medico, dt_hr_consulta })
            console.log(consultaExistente)
            if (consultaExistente.length) {
                return res.status(403).json({ error: 'A data para este Médico já está agendada.' })
            }
            
            //Verificar se a data é maior do que data atual - Comparando valores incompativeis
            //console.log(dt_hr_consulta)
            //console.log(getCurrentTime())
            //if(dt_hr_consulta <= getCurrentTime()){
            //     return res.status(403).json({ error: 'Data inválida: A data/hora da consulta deve ser maior que a data/hora atual.' })
            //}

            // Verifica se o id_especialidade existe e se o médico atende essa especialidade
            const especialidade = await especialidadeDAO.obterUmaEspecialidade(id_especialidade)
            if (!especialidade) {
                return res.status(404).json({ error: 'Especialidade não existente.' })
            }

            const medicoAtendeEspecialidade = await await especialidadeDAO.verificarMedicoEspecialidade({ id_medico, id_especialidade })
            if (!medicoAtendeEspecialidade) {
                return res.status(400).json({error: 'Médico não atende essa especialidade'})
            }   

            await consultaDAO.criarConsulta(consulta)    

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
            const { id_paciente_admin } = req.body

            let id_paciente
            let modificado_por

            if (decode.tipo === 'Paciente') {
                id_paciente = modificado_por = id_usuario
            } else if (decode.tipo === 'Admin') {
                id_paciente = id_paciente_admin
                modificado_por = id_usuario
            }

            const consulta = await consultaDAO.obterUmaConsultaPeloId(id_consulta)

            if (!consulta) {
                return res.status(404).json({ error: 'Consulta não encontrada.' })
            }

            await consultaDAO.agendarConsulta({
                id_consulta,
                id_paciente,
                modificado_por              
            })

            return res.status(200).json({ msg: 'Consulta agendada com sucesso!' })

        } catch(error) {
            next(error)
        }
    },
    obterConsultas: async (req, res, next) => {
        try {
            const { id, tipo } = req.usuario

            const { id_usuario_admin } = req.body

            let id_usuario

            if (tipo === 'Admin') {
                id_usuario = id_usuario_admin
            } else {
                id_usuario = id
            }

            const consultas = await consultaDAO.obterConsultasPeloUsuario({ id_usuario })

            if (!consultas) {
                return res.status(404).json({ error: 'Consultas não encontradas.' })
            }

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

            if (!consulta) {
                return res.status(404).json({ error: 'Consulta não encontrada.' })
            }

            return res.status(200).json(consulta)
        }
        catch (error) {
            next(error)
        }

    },
    cancelar: async (req, res, next) => {
        try {
            const { id, tipo } = req.usuario
            
            const { id_consulta } = req.params

            const { id_usuario_admin } = req.body

            let id_usuario
            let modificado_por

            if (tipo === 'Admin') {
                id_usuario = id_usuario_admin
                modificado_por = id
            } else {
                id_usuario = modificado_por = id
            }

            const consulta = await consultaDAO.obterUmaConsultaPeloId(id_consulta)

            if (!consulta) {
                return res.status(404).json({ error: 'Consulta não encontrada.' })
            }

            if(!id_usuario){
                return res.status(404).json({ error: 'Usuário não encontrado.' })
            }
            
            await consultaDAO.cancelarConsulta({ id_usuario, id_consulta, modificado_por })

            return res.status(200).json({ msg: 'Consulta cancelada com sucesso. '})
        } catch (error) {
            next(error)
        }
    },
    atualizar: async(req, res, next) => {
        try {
            const { id: id_usuario, tipo } = req.usuario

            const { id_consulta } = req.params

            const {
                id_medico_admin,
                id_paciente,
                id_especialidade,
                dt_hr_consulta
            } = req.body

            let id_medico
            let modificado_por

            if (tipo === 'Medico') {
                id_medico = modificado_por = id_usuario
            } else if (tipo === 'Admin') {
                id_medico = id_medico_admin
                modificado_por = id_usuario
            }

            const consulta = await consultaDAO.obterUmaConsultaPeloId(id_consulta)

            if (!consulta) {
                return res.status(404).json({ error: 'Consulta não encontrada.' })
            }

            //if(dt_hr_consulta <= getCurrentTime()) {
            //    return res.status(500).json({error: 'A nova data deve ser maior do que a data atual'})
            //}

            //Verificar se o médico está disponivel no novo horário
            
            await consultaDAO.atualizarConsulta({
                id_consulta,
                id_medico,
                id_paciente,
                id_especialidade,
                dt_hr_consulta,
                modificado_por
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
            const { id } = req.usuario

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
            const { id } = req.usuario

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
            const { id } = req.usuario

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
            const { id } = req.usuario

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