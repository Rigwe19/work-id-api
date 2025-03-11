import Work from '#models/work'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async settings({ auth, request, response }: HttpContext) {
    await auth.check()
    const user = auth.user
    if (!user) {
      response.safeStatus(419)
      return { success: false, message: 'user not authenticated' }
    }

    const works = await Work.query().where('user_id', user.id).orderBy('start', 'desc')

    return {
      success: true,
      works,
    }
  }
}
