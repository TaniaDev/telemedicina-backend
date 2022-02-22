const bcrypt = require('bcryptjs')
const jwt_decode = require('jwt-decode')
const con = require('../database')

module.exports = {
    getAllSpecialties: async (req, res, next) => {
        try {
            const specialties = await con('especialidade')
            return res.status(201).json(specialties)

        } catch (error) {
            next(error)
        }
    },
    registerSpecialty: async(req, res, next) => {
        try {
            const {id_especialidade} = req.body

            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id_medico = decode.id

            const especialidade = await con('especialidade').where({id: id_especialidade})

            if(especialidade == '') {
                return res.status(404).json({error: 'Especialidade não existe!'})
            }

            const results = await con('medico_especialidade').where({id_medico})

            results.map((result, index) => {
                if(result.id_especialidade == id_especialidade){
                    return res.status(500).json({error: 'Essa especialidade já foi atrelada a esse médico!'})
                }
            })
            
            await con('medico_especialidade').insert({id_medico, id_especialidade})
            
            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    },
    getDoctors: async (req, res, next) => {
        try{
            const {id_especialidade} = req.body

            if(id_especialidade == null){
                const results = await con('medico')
                return res.status(200).json({results})
            }else{
                const results = await con('medico_especialidade').select('*')
                    .join('medico', 'medico.id_usuario', '=', 'medico_especialidade.id_medico')
                    .join('especialidade', 'especialidade.id', '=', 'medico_especialidade.id_especialidade') 
                    .where({'medico_especialidade.id_especialidade': id_especialidade})
                return res.status(200).json({results})
            }
        } catch (error) {
            next(error)
        }
    },
    doctorAvailability: async (req, res, next) => {
        try{
            //Array contendo as horas (9,10,11,13,14,15,16,17,18)

            //Almoço - subtrair o horario de inicio e horario final do almoço do array das horas

            const {id_medico} = req.body
            const results = await con('disponibilidade_medica').where({id_medico})
            return res.status(200).json({results})
        }catch (error) {
            next(error)
        }
    }

}