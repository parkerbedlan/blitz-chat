import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { BlitzPage, useParam, useRouter } from "blitz"
import { useEffect, useState } from "react"
import { Socket } from "socket.io"
import io from "socket.io-client"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Layout from "app/core/layouts/Layout"
import { useSocketConnect } from "app/core/hooks/useSocketConnect"

const SocketTest: BlitzPage = () => {
  const currentUser = useCurrentUser()!
  const router = useRouter()
  const roomId = Number(router.query.roomId) || 1

  const [received, setReceived] = useState("nothing yet")

  const socket = useSocketConnect({ roomId, userId: currentUser.id }, [
    {
      ev: "status",
      listener: (data) => {
        console.log(data)
        setReceived(data)
      },
    },
    {
      ev: "hi-from-server",
      listener: (data) => {
        console.log(data)
        setReceived(JSON.stringify(data, null, 2))
      },
    },
  ])

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
