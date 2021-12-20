import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { BlitzPage, useParam, useRouter } from "blitz"
import { useEffect, useState } from "react"
import { Socket } from "socket.io"
import io from "socket.io-client"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Layout from "app/core/layouts/Layout"

const SocketTest: BlitzPage = () => {
  const currentUser = useCurrentUser()!
  const router = useRouter()
  const roomId = Number(router.query.roomId) || 1

  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>(
    undefined
  )

  const [received, setReceived] = useState("nothing yet")
  useEffect(() => {
    if (!currentUser.id || !roomId) return
    console.log("------------------------------")
    setSocket(() => {
      const newSocket = io("http://localhost:3000", {
        query: {
          roomId,
          userId: currentUser.id,
        },
      })

      newSocket.on("status", (data) => {
        console.log(data)
        setReceived(data)
      })
      newSocket.on("hi-from-server", (data) => {
        console.log(data)
        setReceived(JSON.stringify(data, null, 2))
      })

      return newSocket as any
    })
  }, [currentUser.id, roomId])

  return (
    <>
      <pre>received: {received}</pre>
      <button
        onClick={() => {
          socket!.emit("hi-from-client", { message: "hi" })
        }}
      >
        send socket
      </button>
    </>
  )
}

SocketTest.authenticate = true
SocketTest.getLayout = (page) => <Layout>{page}</Layout>

export default SocketTest
