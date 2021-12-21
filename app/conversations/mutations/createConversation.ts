import { AuthenticatedMiddlewareCtx, AuthorizationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { User } from "@prisma/client"

const CreateConversation = z.object({
  email: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateConversation),
  resolver.authorize(),
  async (input, ctx) => {
    if (!ctx.session.userId) throw new AuthorizationError()

    const otherUser = await db.user.findFirst({ where: { email: input.email } })
    if (!otherUser) {
      throw new Error("No user with that email address.")
    }

    // TODO: if a conversation w that person already exists, say "A conversation with that person already exists *here* (hyperlink)"
    await checkConversationExists(ctx, otherUser)

    const conversation = await db.conversation.create({ data: {} })
    await db.userToConversation.create({
      data: { userId: ctx.session.userId, conversationId: conversation.id },
    })
    await db.userToConversation.create({
      data: { userId: otherUser.id, conversationId: conversation.id },
    })

    return conversation
  }
)

const checkConversationExists = async (
  ctx: AuthenticatedMiddlewareCtx,
  otherUser: User
): Promise<void> => {
  const myConversationIds = (
    await db.userToConversation.findMany({
      select: { conversationId: true },
      where: { userId: ctx.session.userId },
    })
  ).map((convo) => convo.conversationId)

  const participantIds = await Promise.all(
    myConversationIds.map(async (convoId) => {
      const users = await db.userToConversation.findMany({
        select: { userId: true },
        where: {
          conversationId: convoId,
          userId: { not: { equals: ctx.session.userId } },
        },
      })
      return users.map((user) => user.userId)
    })
  ).then((values) => {
    console.log(values.flat())
    return values.flat()
  })

  if (participantIds.some((id) => id === otherUser.id))
    throw new Error("A conversation with that user already exists.")
}
