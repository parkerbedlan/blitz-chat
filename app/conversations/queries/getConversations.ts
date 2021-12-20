import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetConversationsInput
  extends Pick<Prisma.ConversationFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetConversationsInput, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: conversations,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.conversation.count({ where }),
      query: (paginateArgs) =>
        db.conversation.findMany({
          ...paginateArgs,
          include: { users: { select: { user: { select: { email: true, id: true } } } } },
          where: {
            ...where,
            AND: { users: { some: { user: { id: { equals: ctx.session.userId } } } } },
          },
          orderBy,
        }),
    })

    return {
      conversations,
      nextPage,
      hasMore,
      count,
    }
  }
)
