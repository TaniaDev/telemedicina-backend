const con = require('../database/database')

module.exports = {
    create: async (req, res, next) => {
        try {
            const { id_medico, id_paciente, status, dt_hr_consulta, dt_hr_notificacao, frequencia_notificacao } = req.body
    
            let id = id_paciente
            const [paciente] = await con('paciente').select('*').where({ id }).limit(1)

            id = id_medico
            const [medico] = await con('medico').select('*').where({ id }).limit(1)

            if (!paciente) 
                return res.status(403).json({ error: 'Paciente não encontrado' })

            if (!medico) 
            return res.status(403).json({ error: 'Médico não encontrado' })

            await con('consulta').insert({
                id_medico, 
                id_paciente, 
                status, 
                dt_hr_consulta, 
                dt_hr_notificacao, 
                frequencia_notificacao
            })

            return res.status(201).json({sucess: 'Consulta cadastrada!'})
        } catch (error) {
            next(error)
        }
        
    }
}