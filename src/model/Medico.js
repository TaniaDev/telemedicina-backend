const Usuario = require('../model/Usuario')

module.exports = class Medico extends Usuario {
    constructor ({
        id,
        crm,
        especialidades
    }) {
        super(id)
        this.id = id
        this.crm = crm
        this.especialidades = especialidades
    }
}