const con = require('../database')
const getCurrentTime = require('../utils/getCurrentTime')

module.exports = class ConsultaDAO {
    async criarConsulta(consulta) {
        const {
            id_medico,
            dt_hr_consulta,
            id_especialidade,
            modificado_por
        } = consulta

        const consultaNova = await con('consulta')
                                .insert({
                                    id_medico,
                                    id_especialidade,
                                    status: 'Disponível',
                                    dt_hr_consulta,
                                    criado_em: getCurrentTime(),
                                    criado_por: modificado_por,
                                    atualizado_em: getCurrentTime(),
                                    atualizado_por: modificado_por
                                })
        return consultaNova
    }

    async agendarConsulta(consulta) {
        const {
            id_consulta,
            id_paciente,
            modificado_por
        } = consulta

        const consultaAgendada = await con('consulta')
            .where({ id: id_consulta })
            .update({
                id_paciente: id_paciente,
                status: "Agendado",
                atualizado_em: getCurrentTime(),
                atualizado_por: modificado_por
            })
        
        return consultaAgendada
    }

    async obterConsultasPeloUsuario(id) {
        const consulta = await con('consulta')
            .select('*')
            .where({ id_paciente: id })
            .orWhere({ id_medico: id })    

        return consulta
    }

    async obterUmaConsultaPeloId(id_consulta) {

        const consulta = await con('consulta')
            .select('*')
            .where({ id: id_consulta })

        return consulta
    }

    async cancelarConsulta(consulta) {
        const {
            id_consulta,
            modificado_por
        } = consulta

        const consultaCancelada = await con('consulta')
            .where({ id: id_consulta })
            .update({
                status: "Cancelado",
                cancelado_em: getCurrentTime(),
                cancelado_por: modificado_por
            })
        
        return consultaCancelada


    }

    async atualizarConsulta(consulta) {
        const {
            id_consulta,
            id_medico,
            id_paciente,
            id_especialidade,
            dt_hr_consulta,
            modificado_por
        } = consulta

        const consultaAtualizada = await con('consulta')
                                    .update({
                                        id_especialidade,
                                        id_paciente,
                                        dt_hr_consulta,
                                        atualizado_em: getCurrentTime(),
                                        atualizado_por: modificado_por
                                    }).where({ id: id_consulta })
        
        return consultaAtualizada
    }

    async verificarDataHorarioExistente(consulta) {
        const {
            id_medico,
            dt_hr_consulta
        } = consulta

        const dtHrExistente = await con('consulta')
                                    .select('id')
                                    .where({
                                        id_medico
                                    })
                                    .andWhere({
                                        dt_hr_consulta
                                    })
        return dtHrExistente
    }

}