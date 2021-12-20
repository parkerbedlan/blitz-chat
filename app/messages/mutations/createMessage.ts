import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateMessage = z.object({
  text: z.string(),
  conversationId: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateMessage),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const message = await db.message.create({ data: { ...input, userId: ctx.session.userId } })

    return message
  }
)
