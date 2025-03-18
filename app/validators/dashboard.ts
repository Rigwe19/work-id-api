import vine from '@vinejs/vine'
const string = vine.string()
export const worksValidator = vine.compile(
  vine.object({
    position: string,
    location: string,
    start: string,
    end: string,
    company: string,
  })
)
export const profileValidator = vine.compile(
  vine.object({
    fullName: string,
    email: vine.string().email().normalizeEmail(),
    location: string,
    phone: vine.string().fixedLength(11),
    linkedIn: vine.string().url().normalizeUrl(),
  })
)
