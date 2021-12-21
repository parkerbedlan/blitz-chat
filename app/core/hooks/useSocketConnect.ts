import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { SocketOrUndefined, useSocketStore } from "./useSocketStore"

export const useSocketConnect: (
  query?:
    | {
        [key: string]: any
      }
    | undefined,
  onHandlers?: { on: string; listener: (...args: any[]) => void }[]
) => SocketOrUndefined = (query, onHandlers) => {
  const socket = useSocketStore((state) => state.socket)
  const setSocket = useSocketStore((state) => state.functionalSet)

  // const dependencies = query ? Object.values(query) : []
  useEffect(
    () => {
      if (query && Object.values(query).some((value) => !value)) return
      console.log("------------------------------")
      setSocket(() => {
        const newSocket = io(process.env.APP_ORIGIN as string, {
          query,
        })

        onHandlers?.forEach((handler) => {
          newSocket.on(handler.on, handler.listener)
        })

        return newSocket
      })
      return () => {
        setSocket((sock) => {
          sock?.disconnect()
          return undefined
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
    // [query, onHandlers, setSocket, ...dependencies]
  )

  return socket
}
