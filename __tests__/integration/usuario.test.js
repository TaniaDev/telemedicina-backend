const Usuario = require('../../src/model/Usuario')


const axios = require('axios')

describe('Usuario', () => {
    describe('Rotas', () => {
        test('GET /usuario/obter/:id', async () => {
            const res = await axios(`http://localhost:3333/usuario/obter/${id}`)

            expect(usuario.nome).toBe('Tania')
        })
    })
})