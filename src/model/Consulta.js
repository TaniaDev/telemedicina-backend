module.exports = class Consulta {
    constructor ({
        id,
        id_medico,
        id_paciente,
        id_especialidade,
        status,
        dt_hr_consulta,
        modificado_por
    }) {
        this.id = id
        this.id_medico = id_medico
        this.id_paciente = id_paciente
        this.id_especialidade = id_especialidade
        this.status = status
        this.dt_hr_consulta = dt_hr_consulta
        this.modificado_por = modificado_por
    }
}