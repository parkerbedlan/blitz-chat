import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateConversation = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateConversation),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const conversation = await db.conversation.update({ where: { id }, data })

    return conversation
  }
)
