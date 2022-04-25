const jwt_decode = require('jwt-decode')
const con = require('../database')

const PacienteDAO = require('../dao/PacienteDAO')
const Paciente = require('../model/Paciente')

let pacienteDAO = new PacienteDAO()

module.exports = {
    cadastrar: async (req, res, next) => {
        try {
            const {
                id,
                peso,
                altura,
                alergia,
                doenca_cronica,
                vicio,
                medicamento,
                antecedente_familiar
            } = req.body

            const paciente = new Paciente({ id, peso, altura, alergia, doenca_cronica, vicio, medicamento, antecedente_familiar })

            await pacienteDAO.cadastrarPaciente(paciente)

            return res.status(201).json({ msg: 'Paciente cadastrado com sucesso!' })
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

            const paciente = await pacienteDAO.obterUmPacientePeloId(id)

            if (!paciente) {
                return res.status(404).json({ error: 'Paciente não existente' })
            }

            return res.status(200).json(paciente)
        } catch (error) {
            next(error)
        }
    },
    atualizar: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const { 
                peso,
                altura,
                alergia,
                doenca_cronica,
                vicio,
                medicamento,
                antecedente_familiar
            } = req.body

            const paciente = await pacienteDAO.obterUmPacientePeloId(id)

            if (!paciente) {
                return res.status(404).json({ error: 'Paciente não existente' })
            }

            await pacienteDAO.atualizarPaciente({ 
                id,
                peso,
                altura,
                alergia,
                doenca_cronica,
                vicio,
                medicamento,
                antecedente_familiar
            })
            
            return res.status(200).json({ msg: 'Paciente atualizado com sucesso!' })
        }catch (error) {
            next(error)
        }
    },
    obterPacienteCompleto: async (req, res, next) => {
        //obter os dados do paciente e os dados de usuário para prontuário
        try {
            const { id } = req.params

            const paciente = await pacienteDAO.obterPacienteCompleto(id)
            console.log(paciente)
            if (!paciente) {
                return res.status(404).json({ error: 'Paciente não existente' })
            }

            return res.status(200).json(paciente)
        } catch (error) {
            next(error)
        }
    },
    obterPacientes: async (req, res, next) => {
        try {
                const pacientes = await medicoDAO.obterTodosPacientes()

                return res.status(200).json(pacientes)
                
        } catch(error) {
            next(error)
        }
    }
}
