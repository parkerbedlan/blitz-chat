import create from "zustand"
import { Socket } from "socket.io-client"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export type SocketOrUndefined = Socket<DefaultEventsMap, DefaultEventsMap> | undefined

type SocketStoreState = {
  socket: SocketOrUndefined
  set: (socket: SocketOrUndefined) => void
  functionalSet: (funct: (socket: SocketOrUndefined) => SocketOrUndefined) => void
}

export const useSocketStore = create<SocketStoreState>((set, _get) => ({
  socket: undefined,
  set: (socket: SocketOrUndefined) => set((state) => ({ socket })),
  functionalSet: (funct: (socket: SocketOrUndefined) => SocketOrUndefined) => {
    set((state) => ({ socket: funct(state.socket) }))
  },
}))
