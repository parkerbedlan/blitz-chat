import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateMessage = z.object({
  id: z.number(),
  text: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateMessage),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const message = await db.message.update({ where: { id }, data })

    return message
  }
)
