import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetMessagesInput
  extends Pick<Prisma.MessageFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetMessagesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: messages,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.message.count({ where }),
      query: (paginateArgs) =>
        db.message.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            user: { select: { email: true } },
          },
        }),
    })

    return {
      messages,
      nextPage,
      hasMore,
      count,
    }
  }
)
