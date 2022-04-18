const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt_decode = require('jwt-decode')
const con = require('../database')

const UsuarioDAO = require('../dao/UsuarioDAO')
const Usuario = require('../model/Usuario')

let usuarioDAO = new UsuarioDAO()
const now = new Date()

module.exports = {
    cadastrar: async (req, res, next) => {
        try {
            const {
                    nome,
                    dt_nascimento,
                    genero,
                    telefone,
                    email,
                    senha,
                    tipo,
                } = req.body

            const usuarioExistente = await usuarioDAO.obterUmPeloEmail(email)

            if (usuarioExistente) {
                return res.status(403).json({ error: 'Usuário já existente com este e-mail'})
            }
            
            const senhaHash = await bcrypt.hash(senha, 10)
            const usuario = new Usuario({ nome, dt_nascimento, genero, telefone, email, senha: senhaHash, tipo })
            console.log(usuario)
            const usuarioNovoId = await usuarioDAO.cadastrar(usuario)

            if (usuarioDAO.tipo === 'Paciente'){
                await con('paciente').insert({id_usuario: usuarioNovoId, peso, altura, alergia, doenca_cronica: doenca, vicio, medicamento})
            } else if(usuarioDAO.tipo === 'Medico'){
                await con('medico').insert({id_usuario: usuarioNovoId, crm})
            }

            return res.status(201).json({msg: 'Usuário cadastrado com sucesso!'})
        } catch(error) {
            next(error)
        }
    },
    obter: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            if (!id) {
                throw new Error('Id não identificado')
            }
            const [results] = usuarioDAO.obter(new Usuario(id))

            return res.json(results)
        } catch(error) {
            next(error)
        }
    },
    atualizar: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id
            
            const {
                nome,
                dt_nascimento,
                genero,
                telefone,
                email,
                senha
            } = req.body
 
            if (senha) {
                const senhaHash = await bcrypt.hash(data.senha, 10)
                senha = senhaHash
            }

            const usuarioExistente = await usuarioDAO.obterUmPeloId(id)

            if (!usuarioExistente) {
                return res.status(404).json({ error: 'Usuário não existente.'})
            }

            await usuarioDAO.atualizar({
                                        id,   
                                        nome,
                                        dt_nascimento,
                                        genero,
                                        telefone,
                                        email,
                                        senha
                                    })

            return res.status(200).json({ msg: 'Usuário atualizado com sucesso!' })
        } catch(error) {
            next(error)
        }
    },
    deletar: async (req, res, next) => {
        try {
            const { id } = req.params
            
            const usuarioExistente = await usuarioDAO.obterUmPeloId(id)

            if (!usuarioExistente) {
                return res.status(404).json({ error: 'Usuário não existente.' })
            }

            await usuarioDAO.deletar(id)

            return res.status(200).json({ msg: 'Usuário deletado com sucesso!' })
        } catch(error) {
            next(error)
        }
    },
    desativar: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id 

            await usuarioDAO.desativar(id)

            return res.status(200).json()        
        } catch(error) {
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
            console.log(token)
            console.log(senha)
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
    getUserByEmail: async (req, res, next) => {
        try{
            const {email} = req.params
            const [result] = await con('usuario').where({email})
            return res.status(200).json(result)
        }catch(error){  
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
