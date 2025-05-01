import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class VerifiesController {
  async workId({ request, response }: HttpContext) {
    const id = request.input('id')
    logger.info('this is work id verification route', id)
    const employee = await User.query().where('work_id', id).first()
    const employees = await User.all()
    console.log(id)
    if (employee) {
      return response.json({
        success: true,
        employee,
        employees,
      })
    }
    response.safeStatus(404)
    return response.json({
      success: false,
      message: 'work data ID is not valid',
      employees,
    })
  }
}
