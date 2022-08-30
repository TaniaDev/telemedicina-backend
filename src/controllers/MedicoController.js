const bcrypt = require('bcryptjs')
const jwt_decode = require('jwt-decode')
const con = require('../database')

module.exports = {
    createDoctor: async (req, res, next) => {
        try {
            const {id_usuario, crm} = req.body
            await con('medico').insert({id_usuario, crm})
            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    },
    createDoctorSpecialty: async (req, res, next) => {
        try {
            const {id_medico, id_especialidade} = req.body

            const medico = await con('medico').where({id_usuario: id_medico})
            const especialidade = await con('especialidade').where({id: id_especialidade})

            if(medico == '') {
                return res.status(404).json({error: 'Médico não existe!'})
            }

            if(especialidade == '') {
                return res.status(404).json({error: 'Especialidade não existe!'})
            }

            await con('medico_especialidade').insert({id_medico, id_especialidade})
            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    },
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
                const results = await con('medico').join('usuario', 'usuario.id', '=', 'medico.id_usuario') 
                return res.status(200).json(results)
            }else{
                const results = await con('medico_especialidade').select('*')
                    .join('medico', 'medico.id_usuario', '=', 'medico_especialidade.id_medico')
                    .join('especialidade', 'especialidade.id', '=', 'medico_especialidade.id_especialidade') 
                    .join('usuario', 'usuario.id', '=', 'medico_especialidade.id_medico') 
                    .where({'medico_especialidade.id_especialidade': id_especialidade})
                return res.status(200).json(results)
            }
        } catch (error) {
            next(error)
        }
    },
    getNewDoctors: async (req, res, next) => {
        try{
            const results = await con('usuario').select('*')
                            .join('medico', 'medico.id_usuario', '=', 'usuario.id')
                            .where({'usuario.tipo': 'Medico'}).andWhere({'usuario.aguardando_validacao': 1})
            
            return res.status(200).json(results)
        } catch (error) {
            next(error)
        }
    },
    getDoctor: async (req, res, next) => {
        try{
            const {id_medico} = req.params
            
            if(id_medico == null){
                return res.status(404).json()
            }

            const [result] = await con('usuario').select('*').join('medico', 'medico.id_usuario', '=', 'usuario.id').where({'id_usuario': id_medico})
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },
    getDoctorsBySpecialty: async (req, res, next) => {
        try{
            const {id_specialty} = req.params

            if(id_specialty == null){
                return res.status(500).json()
            }

            const result = await con('medico_especialidade').select('*')
                            .join('medico', 'medico.id_usuario', '=', 'medico_especialidade.id_medico')
                            .join('usuario', 'usuario.id', '=', 'medico_especialidade.id_medico')
                            .where({'id_especialidade': id_specialty})
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },
    validarMedico: async (req, res, next) => {
        try{
            const {id_medico, nome, email} = req.params
            require('../modules/approvedDoctor')(nome, email)
            await con('usuario').update({'aguardando_validacao': null}).where({id: id_medico})
            return res.status(200).json()
        } catch (error) {
            next(error)
        }
    },
    reprovarMedico: async (req, res, next) => {
        try{
            const {id_medico, nome, email} = req.params
            require('../modules/failDoctor')(nome, email)
            await con('usuario').where({id: id_medico}).del()
            return res.status(200).json()
        } catch (error) {
            next(error)
        }
    },
    delMedicoEspecialidade: async (req, res, next) => {
        try{
            const {id_medico, id_especialidade} = req.params

            await con('medico_especialidade').where({id_medico}).andWhere({id_especialidade}).del()
            return res.status(200).json()
        } catch (error) {
            next(error)
        }
    },
    getSpecialtie: async (req, res, next) => {
        try{
            const {id_especialidade} = req.params
            
            if(id_especialidade == null){
                return res.status(404).json()
            }

            const [result] = await con('especialidade').where({'id': id_especialidade})
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },
    getSpecialtieByDoctor: async (req, res, next) => {
        try{
            const {id_medico} = req.params

            if(id_medico == null){
                return res.status(500).json()
            }

            const result = await con('medico_especialidade').select('*').join('especialidade', 'especialidade.id', '=', 'medico_especialidade.id_especialidade').where({id_medico})
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },
    getSpecialityByDoctor: async (req, res, next) => {
        try{
            const result = await con('medico_especialidade').select('*').join('especialidade', 'especialidade.id', '=', 'medico_especialidade.id_especialidade')
            return res.status(200).json(result)
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
    },
    verifyApproval: async (req, res, next) => {
        try{
            const {email} = req.params
            const [result] = await con('usuario').select('aguardando_validacao').where({email})
            return res.status(200).json(result)
        }catch (error) {
            next(error)
        }
    },

}