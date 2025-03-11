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

router.post('/auth/register', [AuthController, 'register']).as('auth.register')
router.post('/auth/login', [AuthController, 'login']).as('auth.login')
router
  .get('/auth/user', [AuthController, 'user'])
  .as('auth.user')
  .use(middleware.auth({ guards: ['api'] }))
// router
//   .post('/auth/resend-verification-code', [AuthController, 'resendVerificationCode'])
//   .as('auth.resend-code')
// router
// .post('/auth/confirm-verification', [AuthController, 'confirmVerification'])
// .as('auth.confirm-code')

router.get('/dashboard/settings', [DashboardController, 'settings']).as('dashboard.settings')
