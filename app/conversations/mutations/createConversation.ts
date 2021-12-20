import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateConversation = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateConversation),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const conversation = await db.conversation.create({ data: input })

    return conversation
  }
)
