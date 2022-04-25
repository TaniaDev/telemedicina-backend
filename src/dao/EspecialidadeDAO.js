const con = require('../database')
const getCurrentTime = require('../utils/getCurrentTime')

module.exports = class EspecialidadeDAO {
    async cadastrarEspecialidade(especialidade) {
        const {
            nome
        } = especialidade

        const novaEspecialidade = await con('especialidade')
                                        .insert({ nome })

        return novaEspecialidade
    }

    async obterEspecialidadePeloNome(nome) {
        const [especialidade] = await con('especialidade')
                                        .where({ nome })
                                        .select('*')
                                        .limit(1)

        return especialidade
    }

    async obterUmaEspecialidade(id) {
        const [especialidade] = await con('especialidade')
                                        .where({ id })
                                        .select('*')
                                        .limit(1)

        return especialidade
    }

    async obterTodasEspecialidades() {
        const especialidades = await con('especialidade')
                                        select('*')

        return especialidades
    }

    async obterEspecialidadesPeloMedico(id) { 
        const especialidades = await con('especialidade')
                            .select('*')
                            .join('medico_especialidade', 'especialidade.id', '=', 'medico_especialidade.id_especialidade')
                            .where({ 'medico_especialidade.id_medico': id })
                
        return especialidades
    }

    async verificarMedicoEspecialidade(medicoEspecialidade) {
        const {
            id_medico,
            id_especialidade
        } = medicoEspecialidade

        const MedicoEspecialidade = await con('medico_especialidade')
                                        .select('*')
                                        .where({ id_medico: id_medico })
                                        .andWhere({ id_especialidade: id_especialidade })
        
        return MedicoEspecialidade
    }
}
