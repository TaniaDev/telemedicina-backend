const con = require('../database')
const getCurrentTime = require('../utils/getCurrentTime')

module.exports = class PacienteDAO {
    async cadastrarPaciente(paciente) {
        const {
            id,
            peso,
            altura,
            alergia,
            doenca_cronica,
            vicio,
            medicamento,
            antecedente_familiar
        } = paciente

        const pacienteNovo = await con('paciente')
                                .insert({
                                    id_usuario: id,
                                    peso,
                                    altura,
                                    alergia,
                                    doenca_cronica,
                                    vicio,
                                    medicamento,
                                    antecedente_familiar
                                })
        return pacienteNovo
    }

    async obterUmPacientePeloId(id) {
        const [paciente] = await con('paciente')
                            .select('*')
                            .where({ id_usuario: id })
        
        return paciente
    }

    async obterPacienteCompleto(id) {
        const [paciente] = await con('usuario')
                                .select(
                                    'usuario.id',
                                    'usuario.nome',
                                    'usuario.dt_nascimento',
                                    'usuario.genero',
                                    'paciente.peso',
                                    'paciente.altura',
                                    'paciente.doenca_cronica',
                                    'paciente.vicio',
                                    'paciente.medicamento',
                                    'paciente.antecedente_familiar',
                                )
                                .from('usuario')
                                .join('paciente', { 'usuario.id': 'paciente.id_usuario' })
                                .andWhere('paciente.id_usuario', id)
                                .limit(1)
        
        return paciente
    }

    async atualizarPaciente(paciente) {
        const {
            id,
            peso,
            altura,
            alergia,
            doenca_cronica,
            vicio,
            medicamento,
            antecedente_familiar
        } = paciente

        const pacienteAtualizado = await con('paciente')
                                        .update({
                                            peso,
                                            altura,
                                            alergia,
                                            doenca_cronica,
                                            vicio,
                                            medicamento,
                                            antecedente_familiar,
                                            atualizado_em: getCurrentTime()
                                        })
                                        .where({ id_usuario: id })
        
        return pacienteAtualizado
    }

    async obterTodosPacientes() {
        const pacientes = await con('paciente').select('*')

        return pacientes   
    }

    async obterPacientesPeloMedico(id) {
        const pacientes = await con.select(
                            'usuario.nome',
                            'usuario.dt_nascimento',
                            'usuario.genero',
                            'usuario.telefone'
                        )
                        .from('usuario')
                        .innerJoin('paciente', 'usuario.id', '=', 'paciente.id_usuario')
                        .innerJoin('consulta', 'paciente.id_usuario', '=', 'consulta.id_paciente')
                        .innerJoin('medico', 'consulta.id_medico', '=', 'medico.id_usuario')
                        .where('medico.id_usuario', id)

        return pacientes      
    }
}