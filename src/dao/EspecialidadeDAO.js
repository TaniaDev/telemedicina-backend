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
}
