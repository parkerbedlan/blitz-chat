import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { useCurrentUser } from "../../core/hooks/useCurrentUser"

const CreateProject = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateProject),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.create({ data: { ...input, userId: ctx.session.userId } })

    return project
  }
)
