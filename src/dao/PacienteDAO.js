const con = require('../database')
module.exports = class PacienteDAO {
    async obter(paciente){
        return await con('paciente').where({id_usuario: id})
    }
}