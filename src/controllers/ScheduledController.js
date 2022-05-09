const con = require('../database')
const dayjs = require('dayjs')

module.exports = {

    sendNotification: async (req, res, next) => {
            let current = dayjs().format('YYYY-MM-DD HH:mm:00')
            let oneMoreDay = dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:00')
            let oneMoreHour = dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:00')
            let fifteenMoreMinutes = dayjs().add(15, 'minute').format('YYYY-MM-DD HH:mm:00')     

            const results = await con('consulta').select('*')
                .join('usuario', 'usuario.id', '=', 'consulta.id_paciente')
                .where('consulta.dt_hr_consulta', '>', current)
                .andWhere('consulta.status', '=', 'Agendado')

            results.map((result) => {  
                if(dayjs(result.dt_hr_consulta).format('YYYY-MM-DD HH:mm:00') == oneMoreDay){
                    require('../modules/notification')(result.email, result.nome, 24, 'horas')
                }else if(dayjs(result.dt_hr_consulta).format('YYYY-MM-DD HH:mm:00') == oneMoreHour){
                    require('../modules/notification')(result.email, result.nome, 1, 'hora')
                }else if(dayjs(result.dt_hr_consulta).format('YYYY-MM-DD HH:mm:00') == fifteenMoreMinutes){
                    require('../modules/notification')(result.email, result.nome, 15, 'minutos')
                }
            })
        
            return  
    },   
}