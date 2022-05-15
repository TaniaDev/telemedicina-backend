const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UsuarioDAO = require('../dao/UsuarioDAO')
const Usuario = require('../model/Usuario')

const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail')

const authConfig = process.env.SECRET_API

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
                    cep,
                    logradouro,
                    bairro,
                    numero,
                    complemento,
                    cidade,
                    estado
                } = req.body

            const endereco = { cep, logradouro, bairro, numero, complemento, cidade, estado }

            const usuarioExistente = await usuarioDAO.obterUmPeloEmail(email)

            if (usuarioExistente) {
                return res.status(403).json({ error: 'Usuário já existente com este e-mail' })
            }

            if (usuarioExistente.tipo === 'Admin') {
                return res.status(401).json({ error: 'Não autorizado para criar usuários do tipo Admin' })
            }
            
            const senhaHash = await bcrypt.hash(senha, 10)
            const usuario = new Usuario({ nome, dt_nascimento, genero, telefone, endereco, email, senha: senhaHash, tipo })

            await usuarioDAO.cadastrar(usuario)

            return res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' })
        } catch(error) {
            next(error)
        }
    },
    obter: async (req, res, next) => {
        try {
            const { id } = req.usuario
            
            const usuario = await usuarioDAO.obterUmPeloId(id)
            
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não existente'})
            }

            return res.json(usuario)
        } catch(error) {
            next(error)
        }
    },
    obterAdmin: async (req, res, next) => {
        try {
            const { id, tipo } = req.usuario

            const { id_usuario_admin } = req.body

            let id_usuario

            if (tipo === 'Admin') {
                id_usuario = id_usuario_admin
            } else {
                id_usuario = id
            }
            
            const usuario = await usuarioDAO.obterUmPeloId(id_usuario)
            
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não existente'})
            }

            return res.json(usuario)
        } catch(error) {
            next(error)
        }
    },
    obterUmPeloEmail: async (req, res, next) => {
        try {
            const { email } = req.params
            
            const usuario = await usuarioDAO.obterUmPeloEmail(email)
            
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não existente'})
            }

            return res.json(usuario)
        } catch(error) {
            next(error)
        }
    },
    atualizar: async (req, res, next) => {
        try {
            const { id, tipo } = req.usuario
            
            const {
                id_usuario_admin,
                nome,
                dt_nascimento,
                genero,
                telefone,
                email,
                senha,
            } = req.body

            let id_usuario = ''

            if (tipo === 'Admin') {
                id_usuario = id_usuario_admin
            } else {
                id_usuario = id
            }
 
            if (senha) {
                const senhaHash = await bcrypt.hash(data.senha, 10)
                senha = senhaHash
            }

            const usuarioExistente = await usuarioDAO.obterUmPeloId(id_usuario)

            if (!usuarioExistente) {
                return res.status(404).json({ error: 'Usuário não existente.' })
            }

            await usuarioDAO.atualizar({
                id: id_usuario,   
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
    atualizarEndereco: async (req, res, next) => {
        try {
            const { id, tipo } = req.usuario

            const {
                id_usuario_admin,
                cep,
                logradouro,
                numero,
                bairro,
                complemento,
                cidade,
                estado
            } = req.body

            let id_usuario

            if (tipo === 'Admin') {
                id_usuario = id_usuario_admin
            } else {
                id_usuario = id
            }

            const usuarioExistente = await usuarioDAO.obterUmPeloId(id_usuario)

            if (!usuarioExistente) {
                return res.status(404).json({ error: 'Usuário não existente.' })
            }

            await usuarioDAO.atualizarEndereco({
                id: id_usuario,
                cep,
                logradouro,
                numero,
                bairro,
                complemento,
                cidade,
                estado
            })

            return res.status(200).json({ msg: 'Endereço do usuário atualizado com sucesso!' })
        } catch (error) {
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
            const { id } = req.usuario

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
            }, authConfig, { expiresIn: 3600 })

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
              
              jwt.verify(token, authConfig, async function (err, decoded) {
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
    obterUsuarios: async (req, res, next) => {
        try {
            //const { id, page = 1 } = req.query
            const usuarios = await usuarioDAO.obterTodosUsuarios()

            //const countObj = con('usuario').count()

            //const [count] = await countObj
            //res.header('X-Total-Count', count["count"])

            return res.status(200).json(usuarios)

        } catch (error) {
            next(error)
        }
    }
}
