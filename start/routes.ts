/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.delete('/logout', [AuthController, 'logout'])
    router.get('/user', [AuthController, 'user']).use(middleware.auth({ guards: ['api'] }))
    // router
    //   .post('/auth/resend-verification-code', [AuthController, 'resendVerificationCode'])
    //   .as('auth.resend-code')
    // router
    // .post('/auth/confirm-verification', [AuthController, 'confirmVerification'])
    // .as('auth.confirm-code')
  })
  .prefix('/auth')

router
  .group(() => {
    router.get('/settings', [DashboardController, 'settings'])
    router.post('/settings', [DashboardController, 'saveWorks'])
    router.post('/profile', [DashboardController, 'saveProfile'])
    router.get('/search', [DashboardController, 'search'])
    router.get('/user/:workId', [DashboardController, 'user'])
  })
  .use(middleware.auth({ guards: ['api'] }))
  .prefix('/dashboard')
