import User from '#models/user'
import Work from '#models/work'
import { profileValidator, worksValidator } from '#validators/dashboard'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import Case from 'case'

export default class DashboardController {
  async settings({ auth, response }: HttpContext) {
    logger.info('this is settings index route')
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
  async saveWorks({ auth, request, response }: HttpContext) {
    logger.info('this is save work route')
    await auth.check()
    const user = auth.user
    if (!user) {
      response.safeStatus(419)
      return { success: false, message: 'user not authenticated' }
    }

    const data = await request.validateUsing(worksValidator)
    data.position = Case.title(data.position)
    const id = request.input('id')
    // const searchPayload = id ? { id } : {}

    if (id) {
      await Work.query()
        .where('id', id)
        .update({
          userId: user.id,
          ...data,
        })
    } else {
      await Work.create({
        userId: user.id,
        ...data,
      })
    }

    const works = await Work.query().where('user_id', user.id).orderBy('start', 'desc')

    return {
      success: true,
      works,
    }
  }

  async saveProfile({ auth, request, response }: HttpContext) {
    logger.info('this is save profile route')
    await auth.check()
    const user = auth.user
    if (!user) {
      response.safeStatus(419)
      return { success: false, message: 'user not authenticated' }
    }

    const data = await request.validateUsing(profileValidator)

    await User.query()
      .where('id', user.id)
      .update({
        fullName: Case.capital(data.fullName),
        phone: data.phone,
        location: data.location,
        linkedIn: data.linkedIn,
      })
    const updated = await User.find(user.id)
    return {
      success: true,
      user: updated,
    }
  }
  public async search({ auth, request, response }: HttpContext) {
    logger.info('this is search route')
    await auth.check()
    const user = auth.user
    if (!user) {
      response.safeStatus(419)
      return { success: false, message: 'user not authenticated' }
    }

    const q = request.input('q') // Get search query from frontend

    if (!q) {
      return response.status(400).json({ message: 'Search query is required' })
    }

    // Search for work_id (exact match) OR name (partial match)
    const employers = await User.query()
      .where((query) => {
        query
          .where('work_id', q) // Exact match for work ID
          .orWhereRaw('LOWER(full_name) LIKE ?', [`%${q.toLowerCase()}%`]) // Case-insensitive fuzzy match
          .orWhereRaw('LOWER(email) LIKE ?', [`%${q.toLowerCase()}%`])
          .orWhereRaw('LOWER(username) LIKE ?', [`%${q.toLowerCase()}%`])
      })
      .whereNot('id', user.id) // Exclude current user
      .whereNotIn('role', ['admin', 'employer']) // Exclude admins and employers
      .limit(10) // Limit results for performance

    return {
      success: true,
      employers,
    }
    // return response.json(employers)
  }

  public async user({ auth, params, request, response }: HttpContext) {
    logger.info('this is user route')
    await auth.check()
    const user = auth.user
    if (!user) {
      response.safeStatus(419)
      return { success: false, message: 'user not authenticated' }
    }

    const workId = params.workId

    if (!workId) {
      return response.status(400).json({ message: 'Work ID is required' })
    }

    const work = await User.query().preload('works').where('workId', workId).first()

    if (!work) {
      return response.status(404).json({ message: 'Work experience not found' })
    }

    return {
      success: true,
      work,
    }
  }
}
