import { email } from "app/auth/validations"
import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetConversation = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetConversation),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const conversation = await db.conversation.findFirst({
      where: { id },
      include: {
        users: { select: { user: { select: { email: true, id: true } } } },
      },
    })

    if (!conversation) throw new NotFoundError()

    return conversation
  }
)
