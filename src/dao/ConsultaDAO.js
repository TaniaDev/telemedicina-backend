const con = require('../database')
const getCurrentTime = require('../utils/getCurrentTime')

module.exports = class ConsultaDAO {
    async criarConsulta(consulta) {
        const {
            id_medico,
            dt_hr_consulta,
            id_especialidade
        } = consulta

        const consultaNova = await con('consulta')
                                .insert({
                                    id_medico,
                                    id_especialidade,
                                    status: 'Disponível',
                                    dt_hr_consulta,
                                    criado_em: getCurrentTime(),
                                    criado_por: id_medico,
                                    atualizado_em: getCurrentTime(),
                                    atualizado_por: id_medico
                                })
        return consultaNova
    }

    async agendarConsulta(consulta) {
        const {
            id_consulta,
            id_usuario
        } = consulta

        const consultaAgendada = await con('consulta')
            .where({ id: id_consulta })
            .update({
                id_paciente: id_usuario,
                status: "Agendado",
                atualizado_em: getCurrentTime(),
                atualizado_por: id_usuario
            })
        
        return consultaAgendada
    }

    async obterConsultasPeloUsuario(usuario) {
        const {
            id_usuario,
            tipo_usuario
        } = usuario

        let consulta = {}

        if (tipo_usuario === 'Paciente') {
            consulta = await con('consulta')
                .select('*')
                .where({ id_paciente: id_usuario })    
        }
        else if (tipo_usuario === 'Medico') {
            consulta = await con('consulta')
                .select('*')
                .where({ id_medico: id_usuario })    
        }

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
            id_cancelador
        } = consulta

        const consultaCancelada = await con('consulta')
            .where({ id: id_consulta })
            .update({
                status: "Cancelado",
                cancelado_em: getCurrentTime(),
                cancelado_por: id_cancelador
            })
        
        return consultaCancelada


    }

    async atualizarConsulta(consulta) {
        const {
            id_consulta,
            id_medico,
            id_paciente,
            id_especialidade,
            dt_hr_consulta
        } = consulta

        const consultaAtualizada = await con('consulta')
                                    .update({
                                        id_especialidade,
                                        id_paciente,
                                        dt_hr_consulta,
                                        atualizado_em: getCurrentTime(),
                                        atualizado_por: id_medico
                                    }).where({ id: id_consulta })
        
        return consultaAtualizada
    }

}