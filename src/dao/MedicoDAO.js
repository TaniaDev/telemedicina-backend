const con = require('../database')
const getCurrentTime = require('../utils/getCurrentTime')

module.exports = class MedicoDAO {
    async cadastrarMedico(medico) {
        const {
            id,
            crm,
            especialidades
        } = medico

        const novoMedico = await con('medico')
                                .insert({
                                    id_usuario: id,
                                    crm
                                })

        for (let i=0; i<especialidades.length; i++) {
            await con('medico_especialidade')
            .insert({
                id_medico: id,
                id_especialidade: especialidades[i]
            })
        }                  

        return novoMedico
    }

    async obterUmMedicoPeloId(id) {
        const [medico] = await con('medico')
                            .select('*')
                            .where({ id_usuario: id })
        
        return medico
    }

    async obterMedicoCompleto(id) {
        const [medico] = await con('usuario')
                                .select(
                                    'usuario.id',
                                    'usuario.nome',
                                    'usuario.dt_nascimento',
                                    'usuario.genero',
                                    'medico.crm'
                                )
                                .from('usuario')
                                .join('medico', { 'usuario.id': 'medico.id_usuario' })
                                .andWhere({ id })
                                .limit(1)

        const especialidades = await con('especialidade')
                                        .select(
                                            'especialidade.id',
                                            'especialidade.nome'
                                        )
                                        .from('especialidade')
                                        .join('medico_especialidade', { 'medico_especialidade.id_especialidade': 'especialidade.id' })
                                        .join('medico', { 'medico.id_usuario': 'medico_especialidade.id_medico'})
                                        .andWhere({ 'medico.id_usuario': id })
         
        return { medico, especialidades }
    }

    async atualizarMedico(medico) {
        const {
            id,
            crm,
            especialidades
        } = medico

        const medicoAtualizado = await con('medico')
                                        .update({
                                            id,
                                            crm,
                                            especialidades,
                                            atualizado_em: getCurrentTime()
                                        })
                                        .where({ id_usuario: id })
        
        return medicoAtualizado
    }

}
