const con = require('../database')

module.exports = {
    cancel: async (req, res, next) => {
        try{
            const { id_consulta, id_cancelador } = req.body

            if(!id_consulta){
                return res.status(400).json({error: 'Informe o id da consulta'})
            }

            if(!id_cancelador){
                return res.status(400).json({error: 'Informe o id do usuário'})
            }

            const consulta = await con('consulta').where({id: id_consulta})
            
          
            if(!consulta[0].id){
                return res.status(400).json({error: 'Consulta não existe'})
            }

            if((consulta[0].id_medico != id_cancelador) && (consulta[0].id_paciente != id_cancelador)){
                return res.status(400).json({error: 'Somente o paciente ou médico podem cancelar a consulta'})
            }
            
            const now = new Date()
            await con('consulta')
                .update({
                    status: "cancelado", 
                    dt_hr_consulta: null, 
                    atualizado_em: now, 
                    cancelado_em: now, 
                    cancelado_por: id_cancelador})
                .where({id: id_consulta})

            return res.status(200).json()
        } catch (error) {
            next(error)
        }
    },
}
