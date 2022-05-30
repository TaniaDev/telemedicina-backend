const jwt = require('jsonwebtoken')

const authConfig = process.env.SECRET_API

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não informado'})
    }

    const parts = authHeader.split(' ')

    if (!parts.length === 2) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    const [ scheme, token ] = parts;

     if (!/^Bearer$/i.test(scheme)){
      return res.status(401).json({ error: 'Token malformatado' })
    }
    jwt.verify(token, authConfig, function (err, decoded) {

      if (err) {
        return res.status(403).send({ error: 'Acesso negado' })
      }
      const usuario = {
        id: decoded.id,
        nome: decoded.nome,
        tipo: decoded.tipo
      }
      req.usuario = usuario
      next()
  })
}
