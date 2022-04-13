module.exports = class Usuario {
    constructor ({
        id, 
        nome, 
        dt_nascimento,
        genero,
        telefone,
        email,
        senha,
        tipo,
        criado_em,
        atualizado_em,
        desativado_em,
        token,
        token_expira_em
    }) {
        this.id = id
        this.nome = nome
        this.dt_nascimento = dt_nascimento
        this.genero = genero
        this.telefone = telefone
        this.email = email
        this.senha = senha
        this.tipo = tipo
        this.criado_em = criado_em
        this.atualizado_em = atualizado_em
        this.desativado_em = desativado_em
        this.token = token
        this.token_expira_em = token_expira_em
    }

}
