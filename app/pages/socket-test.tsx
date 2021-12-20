import { BlitzPage } from "blitz"
import { useEffect, useState } from "react"
import io from "socket.io-client"

const socket = io("http://localhost:3000")

const SocketTest: BlitzPage = () => {
  const [received, setReceived] = useState("nothing yet")
  useEffect(() => {
    socket.on("status", (data) => {
      console.log(data)
      setReceived(data)
    })
    socket.on("hi-from-server", (data) => {
      console.log(data)
      setReceived(JSON.stringify(data, null, 2))
    })
  }, [])

  return (
    <>
      <pre>received: {received}</pre>
      <button
        onClick={() => {
          socket.emit("hi-from-client", { hello: "world" })
        }}
      >
        send socket
      </button>
    </>
  )
}

export default SocketTest
