import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetMessage = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetMessage), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const message = await db.message.findFirst({ where: { id } })

  if (!message) throw new NotFoundError()

  return message
})
