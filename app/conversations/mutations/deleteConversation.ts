import { AuthorizationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteConversation = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteConversation),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userToConversation = await db.userToConversation.findFirst({
      where: { userId: ctx.session.userId, conversationId: id },
    })
    if (!userToConversation)
      return new AuthorizationError("You lack permissions to delete this conversation.")

    const userToConversationEntries = await db.userToConversation.deleteMany({
      where: { conversationId: id },
    })
    const messages = await db.message.deleteMany({ where: { conversationId: id } })
    const conversation = await db.conversation.deleteMany({ where: { id } })

    return conversation
  }
)
