import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useSocketConnect } from "app/core/hooks/useSocketConnect"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, useRouter } from "blitz"
import { useState } from "react"

const SocketTest: BlitzPage = () => {
  const currentUser = useCurrentUser()!
  const router = useRouter()
  const roomId = Number(router.query.roomId) || 1

  const [received, setReceived] = useState("nothing yet")

  const socket = useSocketConnect({ roomId, userId: currentUser.id }, [
    {
      on: "status",
      listener: (data) => {
        console.log(data)
        setReceived(data)
      },
    },
    {
      on: "hi-from-server",
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
