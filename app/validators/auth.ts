import vine from '@vinejs/vine'
const password = vine.string().minLength(8)
const email = vine.string().email().normalizeEmail()
const confirm = vine.string().confirmed({ confirmationField: 'password' })
export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()
        // console.log(!match?.id)
        return !match?.id
      }),
    full_name: vine.string(),
    location: vine.string(),
    phone: vine
      .string()
      .fixedLength(11)
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('phone', value).first()
        // console.log(!match?.id)
        return !match?.id
      }),
    username: vine.string().unique(async (db, value) => {
      const match = await db.from('users').select('id').where('username', value).first()
      // console.log(!match?.id)
      return !match?.id
    }),
    role: vine.enum(['employee', 'employer', 'admin']),
    password,
    confirm,
  })
)

export const emailValidator = vine.compile(
  vine.object({
    email,
  })
)

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password,
  })
)

export const verifyValidator = vine.compile(
  vine.object({
    email,
    code: vine.number(),
  })
)

export const bvnValidator = vine.compile(
  vine.object({
    bvn: vine.number(),
  })
)
