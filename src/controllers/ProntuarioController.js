const jwt_decode = require('jwt-decode')
const con = require('../database')

module.exports = {
    // Criar um middleware de verificação se o médico tem uma consulta com o paciente em questão agendada para que possa consultar 
    // e/ou inserir no prontuário
    getProntuario: async (req, res, next) => {
        try{
            const {id_paciente} = req.params

            const result = await con('prontuario').select('*', 'medico.nome as medico', 'paciente.nome as paciente')
                                .join('usuario as paciente', 'paciente.id', '=', 'prontuario.id_paciente') 
                                .join('usuario as medico', 'medico.id', '=', 'prontuario.id_medico') 
                                .where({'prontuario.id_paciente' : id_paciente})
                                .orderBy('dt_hr_consulta', 'desc')
            return res.status(200).json(result)
        }catch (error) {
            next(error)
        }
    },
    createProntuario: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_medico = decode.id

            const {id_paciente, dt_hr_consulta, doenca, motivo_consulta, tempo_doente, sintoma, resumo} = req.body

            await con('prontuario').insert({
                id_paciente, 
                id_medico, 	
                dt_hr_consulta,
                doenca, 
                motivo_consulta, 
                tempo_doente, 
                sintoma, 
                resumo
            })

            return res.status(200).json()
        }catch (error) {
            next(error)
        }
    }
}