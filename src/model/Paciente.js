const Usuario = require('../model/Usuario')

module.exports = class Paciente extends Usuario {
    constructor ({
        id,
        peso,
        altura,
        alergia,
        doenca_cronica,
        vicio,
        medicamento,
        antecedente_familiar
    }) {
        super(id)
        this.id = id
        this.peso = peso
        this.altura = altura
        this.alergia = alergia
        this.doenca_cronica = doenca_cronica
        this.vicio = vicio
        this.medicamento = medicamento
        this.antecedente_familiar = antecedente_familiar
    }
}