const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt_decode = require('jwt-decode')
const con = require('../database')

module.exports = {
    create: async (req, res, next) => {
        try {
            const { nome, dt_nascimento, genero, telefone, email, senha, tipo, cep, numero, complemento, cidade, estado, peso, altura, alergia, doenca, vicio, medicamento, crm} = req.body
            const emailExistente = await con('usuario').where({ email }).select('usuario.email')

            if (emailExistente.length != 0) {
                return res.status(403).json({ error: 'Usuário já existente com este e-mail'})
            } else {
                const senhaHash = await bcrypt.hash(senha, 10);

                const user = await con('usuario').insert({nome, dt_nascimento, genero, telefone, email, senha: senhaHash, tipo}).returning('id')
                await con('endereco').insert({id_usuario: user[0].id,  cep, numero, complemento, cidade, estado})

                if(tipo === 'Paciente'){
                    await con('paciente').insert({id_usuario: user[0].id, peso, altura, alergia, doenca_cronica: doenca, vicio, medicamento})
                }else if(tipo === 'Medico'){
                    await con('medico').insert({id_usuario: user[0].id, crm})
                }

                return res.status(201).json({msg: 'Usuário cadastrado com sucesso!'})
            }
        } catch (error) {
            next(error)
        }
    },
    read: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            if (!id) {
                throw new Error('Id não identificado')
            }
            const [results] = await con('usuario')
                .where({ id: id })
                .select('usuario.nome',
                        'usuario.genero',
                        'usuario.telefone',
                        'usuario.email',
                        'usuario.senha')
                .limit(1)

            return res.json(results)

        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id
            
            const { data } = req.body
            if(data.senha){
                const senhaHash = await bcrypt.hash(data.senha, 10);
                data.senha = senhaHash
            }

            await con('usuario').update(data).where({ id })
            return res.send()
        } catch (error) {
            next(error)
        }
    },
    updateDadosPessoais: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id
            
            const { nome, genero, telefone, email } = req.body
            
            await con('usuario').update({nome, genero, telefone, email}).where({ id })
            return res.send()
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.params

            await con('usuario')
            .where({ id })
            .del()

            return res.send()
        } catch (error) {
            next(error)
        }
    },
    disable: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const now = new Date()
            await con('usuario').update({desativado_em: now}).where({id})
            return res.status(200).json()        
        }catch (error) {
            next(error)
        }
    },
    forgot_password: async(req, res, next) => {
        try{
            const { nome, email } = req.body

            const usuario = await con('usuario').where({email})
            if(!usuario){
                return res.status(400).send({error: 'Usuário não encontrado!'})
            }

            const token = crypto.randomBytes(20).toString('hex')
            const now = new Date()
            now.setHours(now.getHours() + 1)

            await con('usuario').update({resetToken: token, resetTokenExpires: now}).where({email})

            require('../modules/mailer')(email, nome, token)

            return res.status(200).send({token, email})
        } catch (error) {
            next(error)
        }
    },
    reset_passowrd: async(req, res, next) => {
        try {
            const { token } = req.params
            const { email, senha } = req.body

            const [usuario] = await con('usuario').where({resetToken: token})

            if(!usuario || token !== usuario.resetToken){
                return res.status(400).send({error: 'Token inválido!'})
            }
            const now = new Date()

            if(now > usuario.resetTokenExpires){
                return res.status(400).send({error: 'Token expirou, gere um novo!'})
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            await con('usuario').update({senha: senhaHash}).where({id: usuario.id})
            
            return res.status(200).send()

        } catch (error) {
            next(error)
        }
    },
    getEmail: async (req, res, next) => {
        try{
            const { token } = req.params
            const [email] = await con('usuario').select('email','nome').where({ resetToken: token })

            return res.status(200).json(email)
        } catch (error) {
            next(error)
        }
    },
    getUserByEmail: async (req, res, next) => {
        try{
            const {email} = req.params
            const [result] = await con('usuario').where({email})
            return res.status(200).json(result)
        }catch(error){  
            next(error)
        }
    },
    getUserById: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const [result] = await con('usuario').where({id})
            return res.status(200).json(result)
        }catch(error){  
            next(error)
        }
    },
    getType: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)

            const [tipo] = await con('usuario').select('tipo').where({ id: decode.id })

            return res.status(200).json(tipo)
        } catch (error) {
            next(error)
        }
    },
    getEndereco: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const [result] = await con('endereco').where({id_usuario: id})
            
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },
    updateEndereco: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id
            const {cep, numero, complemento, cidade, estado} = req.body

            await con('endereco').update({cep, numero, complemento, cidade, estado}).where({id_usuario: id})
            return res.status(200).json()
        }catch (error) {
            next(error)
        }
    }
}
