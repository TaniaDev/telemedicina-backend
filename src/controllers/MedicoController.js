const bcrypt = require('bcryptjs')
const jwt_decode = require('jwt-decode')
const con = require('../database')

const MedicoDAO = require('../dao/MedicoDAO')
const EspecialidadeDAO = require('../dao/EspecialidadeDAO')
const Medico = require('../model/Medico')

let medicoDAO = new MedicoDAO()
let especialidadeDAO = new EspecialidadeDAO()

module.exports = {
    cadastrar: async (req, res, next) => {
        try {
            const { 
                id,
                crm,
                especialidades
             } = req.body
            
            const medico = new Medico({ id, crm, especialidades })

            await medicoDAO.cadastrarMedico(medico)

            return res.status(201).json({ msg: 'Médico cadastrado com sucesso!' })
        }
        catch(error) {
            next(error)
        }
    },
    obter: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const medico = await medicoDAO.obterUmMedicoPeloId(id)

            if (!medico){
                return res.status(404).json({ error: 'Médico não existente' })
            }

            return res.status(200).json(medico)
        }
        catch(error) {
            next(error)
        }
    },
    atualizar: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const {
                especialidades
            } = req.body

            especialidades.map(async (result, index) => {
                let especialidade = await especialidadeDAO.obterUmaEspecialidade(result)
                if(especialidade === null) {
                    return res.status(404).json({ error: 'Especialidade não existente.' })
                }
            })

            const medicoEspecialidade = await medicoDAO(id)
            medicoEspecialidade.map((result, index) => {
                if(result.id_especialidade == id_especialidade){
                    return res.status(500).json({ error: 'Essa especialidade já foi atrelada a este Médico!' })
                }
            })

            await medicoDAO.atualizarMedico({ id, especialidades })
            
            return res.status(200).json({ msg: 'Médico atualizado com sucesso!'})

        } catch (error) {
            next(error)
        }
        
    },
    obterMedicoCompleto: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const medico = await medicoDAO.obterMedicoCompleto(id)

            return res.status(200).json(medico)
        }
        catch(error) {
            next(error)
        }
    },
    obterMedicos: async (req, res, next) => {
        try {
                const medicos = await medicoDAO.obterTodosMedicos()

                return res.status(200).json(medicos)

        } catch(error) {
            next(error)
        }
    },
    obterMedicosPelaEspecialidade: async (req, res, next) => {
        try {
            const { id_especialidade } = req.params

            const especialidade = await especialidadeDAO.obterUmaEspecialidade(id_especialidade)
            if(!especialidade){
                return res.status(404).json({ error: 'Especialidade não existente.' })
            }

            const medicos = await medicoDAO.obterMedicosPelaEspecialidade(id_especialidade)

            return res.status(200).json(medicos)
        } catch (error) {
            next(error)
        }
    }

}