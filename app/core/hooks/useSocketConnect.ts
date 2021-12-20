import { useEffect, useState } from "react"
import { Socket } from "socket.io"
import { io } from "socket.io-client"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

type SocketOrUndefined = Socket<DefaultEventsMap, DefaultEventsMap> | undefined

export const useSocketConnect: () => SocketOrUndefined = (
  query?:
    | {
        [key: string]: any
      }
    | undefined,
  onHandlers?: { ev: string; listener: (...args: any[]) => void }[]
) => {
  const [socket, setSocket] = useState<SocketOrUndefined>(undefined)

  const dependencies = query ? Object.values(query) : []
  useEffect(() => {
    if (query && Object.values(query).some((value) => !value)) return
    console.log("------------------------------")
    setSocket(() => {
      const newSocket = io("http://localhost:3000", {
        query,
      })

      onHandlers?.forEach((handler) => {
        newSocket.on(handler.ev, handler.listener)
      })

      return newSocket as any
    })
    return () => {
      setSocket((sock) => {
        sock?.disconnect()
        return undefined
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, onHandlers, ...dependencies])

  return socket
}
