module.exports = class Usuario {
    constructor ({
        id, 
        nome, 
        dt_nascimento,
        genero,
        telefone,
        endereco,
        email,
        senha,
        tipo
    }) {
        this.id = id
        this.nome = nome
        this.dt_nascimento = dt_nascimento
        this.genero = genero
        this.telefone = telefone
        this.endereco = endereco
        this.email = email
        this.senha = senha
        this.tipo = tipo
    }

}
