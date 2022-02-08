const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const con = require('../database');

module.exports = {
    create: async (req, res, next) => {
        try {
            const usuario = req.body

            const emailExistente = await con('usuario').where({ email: usuario.email }).select('usuario.email')
            console.log(emailExistente)

            if (emailExistente.length != 0) {
                return res.status(403).json({ error: 'Usuário já existente com este e-mail'})
            } else {
                const senhaHash = await bcrypt.hash(usuario.senha, 10);

                await con('usuario').insert({
                    nome: usuario.nome,
                    dt_nascimento: usuario.dt_nascimento,
                    genero: usuario.genero,
                    email: usuario.email,
                    senha: senhaHash
                })

                usuario.senha = undefined

                return res.status(201).json(usuario)
            }
        } catch (error) {
            next(error)
        }
    },
    index: async (req, res, next) => {
        try {
            const { id, page = 1 } = req.query
            const query = await con('usuario')
            .limit(10)
            .offset((page - 1) * 10)
            .orderBy('id')

            const countObj = con('usuario').count()

            if (id) {
                query
                .where({ id })
                .select('usuario.email')
            }

            const [count] = await countObj
            res.header('X-Total-Count', count["count"])

            const results = await query

            return res.json(results);

        } catch (error) {
            next(error)
        }
    },
    read: async (req, res, next) => {
        try {
            const { id } = req.params
            if (!id) {
                throw new Error('Id não identificado')
            }
            const [results] = await con('usuario')
                .where({ id: id })
                .select('usuario.nome',
                        'usuario.dt_nascimento',
                        'usuario.genero',
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
            const { data } = req.body
            const { id } = req.params
        
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
    forgot_password: async(req, res, next) => {
        try{
            const {email} = req.body
            const usuario = await con('usuario').where({email})
            
            if(!usuario){
                return res.status(400).send({error: 'Usuário não encontrado!'})
            }

            const token = crypto.randomBytes(20).toString('hex')
            const now = new Date()
            now.setHours(now.getHours() + 1)

            await con('usuario').update({resetToken: token, resetTokenExpires: now}).where({email})

            return res.status(200).send({token, email})
        } catch (error) {
            next(error)
        }
    },
    reset_passowrd: async(req, res, next) => {
        try{
            const {token} = req.params
            const {senha} = req.body

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
}
