const EspecialidadeDAO = require('../dao/EspecialidadeDAO')
const Especialidade = require('../model/Especialidade')
const MedicoDAO = require('../dao/MedicoDAO')


let especialidadeDAO = new EspecialidadeDAO()
let medicoDAO = new MedicoDAO()

module.exports = {
    cadastrarEspecialidade: async (req, res, next) => {
        try {
            const { nome } = req.body

            const especialidadeExistente = await especialidadeDAO.obterEspecialidadePeloNome(nome)

            if (especialidadeExistente) {
                return res.status(403).json({ error: 'Especialidade já cadastrada.' })
            }

            const especialidade = new Especialidade({ nome })

            await especialidadeDAO.cadastrarEspecialidade(especialidade)

            return res.status(201).json({ msg: 'Especialidade cadastrada com sucesso!' })

        } catch(error) {
            next(error)
        }
    },
    obterUmaEspecialidade: async (req, res, next) => {
        try {
            const { id } = req.params

            const especialidade = await especialidadeDAO.obterUmaEspecialidade(id)

            if (!especialidade) {
                return res.status(404).json({ error: 'Especialidade não encontrada.' })
            }

            return res.status(200).json(especialidade)

        } catch(error) {
            next(error)
        }
    },
    obterEspecialidades: async (req, res, next) => {
        try {
            const especialidades = await especialidadeDAO.obterTodasEspecialidades

            return res.status(201).json(especialidades)
    
        } catch (error) {
            next(error)
        }
    },
    obterEspecialidadesPeloMedico: async (req, res, next) => {
        try {
            const { id_medico } = req.params

            const medico = await medicoDAO.obterUmMedicoPeloId(id_medico)
            if(!medico){
                return res.status(404).json({ error: 'Médico não existente.' })
            }

            const medicos = await medicoDAO.obterMedicosPelaEspecialidade(id_especialidade)

            return res.status(200).json(medicos)
        } catch (error) {
            next(error)
        }
    }
    
}


