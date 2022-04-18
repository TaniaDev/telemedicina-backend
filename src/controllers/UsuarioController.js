const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt_decode = require('jwt-decode')
const jwt = require('jsonwebtoken')
const con = require('../database')
const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail')
const authConfig = require('../config/auth');

const UsuarioDAO = require('../dao/UsuarioDAO')
const Usuario = require('../model/Usuario');
const getCurrentTime = require('../utils/getCurrentTime');

let usuarioDAO = new UsuarioDAO()

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
                return res.status(404).json({ error: 'Usuário não existente.' })
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

            return res.status(200).json({ msg: 'Usuário deletado com sucesso.' })
        } catch(error) {
            next(error)
        }
    },
    desativar: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization
            const decode = jwt_decode(authHeader)
            const id = decode.id

            const usuarioExistente = await usuarioDAO.obterUmPeloId(id)

            if (!usuarioExistente) {
                return res.status(404).json({ error: 'Usuário não existente.' })
            }

            await usuarioDAO.desativar(id)

            return res.status(200).json({ msg: 'Usuário desativado com sucesso.' })        
        } catch(error) {
            next(error)
        }
    },
    esqueceu_senha: async(req, res, next) => {
        try{
            const { email } = req.body
            const usuario = await usuarioDAO.obterUmPeloEmail(email)

            if(!usuario){
                return res.status(404).send({error: 'Usuário não encontrado!'})
            }

            const token = jwt.sign({
                email: usuario.email,
            }, authConfig.secret, { expiresIn: 3600 })

            await sendResetPasswordEmail(email, usuario.nome, token)

            return res.status(200).send({ msg: "Verifique seu E-mail para redefinição de senha." })
        } catch (error) {
            next(error)
        }
    },
    redefinir_senha: async(req, res, next) => {
        try {
            const { senha, token } = req.body

            if (!token) {
                return res.status(401).json({ error: 'Token não informado'})
              }
              
              jwt.verify(token, authConfig.secret, async function (err, decoded) {
                  if (err) {
                      return res.status(403).json({ error: 'Acesso negado' })
                    }
                    const { email } = decoded
                    const senhaHash = await bcrypt.hash(senha, 10);
                    await usuarioDAO.atualizarSenhaPeloEmail(senhaHash, email)
                return res.status(200).json({ msg: "Senha atualizada com sucesso." })
            })
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
