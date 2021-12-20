import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteMessage = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteMessage), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const message = await db.message.deleteMany({ where: { id } })

  return message
})
