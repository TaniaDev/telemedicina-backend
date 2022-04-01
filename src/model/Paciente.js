const Usuario = require('./Usuario')
module.exports = class Medico extends Usuario{
    constructor (id, peso, altura, alergia, doenca_cronica, vicio, medicamento){
        this.id = id
        this.peso = peso;
        this.altura = altura;
        this.alergia = alergia;
        this.doenca_cronica = doenca_cronica;
        this.vicio = vicio;
        this.medicamento = medicamento;
    }
}