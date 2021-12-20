// server.ts
import blitz from "blitz/custom-server"
import { BlitzApiHandler } from "blitz"
import * as http from "http"
import * as socketio from "socket.io"
import express, { Express, Request, Response } from "express"
import { parse } from "url"
import { log } from "next/dist/server/lib/logging"

const { PORT = "3000" } = process.env
const dev = process.env.NODE_ENV !== "production"
const blitzApp = blitz({ dev })
const blitzHandler: BlitzApiHandler = blitzApp.getRequestHandler()

blitzApp.prepare().then(async () => {
  const app: Express = express()
  const server: http.Server = http.createServer(app)
  const io: socketio.Server = new socketio.Server()
  io.attach(server)

  app.get("/hello", async (_: Request, res: Response) => {
    res.send("Hello World")
  })

  io.on("connection", (socket: socketio.Socket) => {
    console.log("connection")
    socket.emit("status", "Hello from Socket.io")

    socket.on("hi-from-client", (data) => {
      console.log("hi-from-client received, sending hi-from-server")
      socket.emit("hi-from-server", data)
    })

    socket.on("disconnect", () => {
      console.log("client disconnected")
    })
  })

  app.all("*", (req: any, res: any) => blitzHandler(req, res))

  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
