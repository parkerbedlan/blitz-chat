// server.ts
import blitz from "blitz/custom-server"
import { createServer } from "http"
import { parse } from "url"
import { log } from "next/dist/server/lib/logging"

const { PORT = "3000" } = process.env
const dev = process.env.NODE_ENV !== "production"
const app = blitz({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url!, true)
    const { pathname, query } = parsedUrl

    if (pathname === "/hello") {
      res.writeHead(200).end("world")
      return
    }

    if (pathname === "/a") {
      // renders app/pages/a.tsx
      app.render(req, res, "/a", query)
      return
    }

    handle(req, res, parsedUrl)
  }).listen(PORT, () => {
    log.success(`Ready on http://localhost:${PORT}`)
  })
})
