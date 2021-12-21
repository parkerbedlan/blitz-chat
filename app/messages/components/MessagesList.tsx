import { Message } from "@prisma/client"
import { useSocketConnect } from "app/core/hooks/useSocketConnect"
import { usePaginatedQuery } from "blitz"
import { useEffect, useState } from "react"
import getMessages from "../queries/getMessages"

const ITEMS_PER_PAGE = 4

export const MessagesList = ({ conversationId }: { conversationId: number }) => {
  const [page, setPage] = useState(0)
  const [{ messages, hasMore }] = usePaginatedQuery(getMessages, {
    where: { conversation: { id: conversationId! } },
    orderBy: { id: "desc" },
    take: ITEMS_PER_PAGE * (page + 1),
  })
  const goToNextPage = () => setPage((p) => p + 1)

  const [liveMessages, setLiveMessages] = useState<Message[]>([])
  const _socket = useSocketConnect({ conversationId }, [
    {
      on: "new-remote-message",
      listener: (data: Message) => {
        console.log("new-remote-message", data)
        setLiveMessages((liveMessages) => [...liveMessages, data])
      },
    },
  ])
  // remove duplicates
  useEffect(() => {
    setLiveMessages((liveMessages) =>
      liveMessages.filter(
        (liveMessage) => !messages.some((message) => message.id === liveMessage.id)
      )
    )
  }, [messages])

  return (
    <>
      {/* <pre>{JSON.stringify(liveMessages, null, 2)}</pre> */}
      <div
        style={{
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column-reverse",
          height: "10em",
        }}
      >
        <div>
          <button disabled={!hasMore} onClick={goToNextPage}>
            Load more
          </button>
          <ul>
            {messages
              .slice(0)
              .reverse()
              .map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            {liveMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

const MessageBubble = ({ message }: { message: Message }) => {
  return (
    <li>
      <p>
        {message.userId}: {message.text}
      </p>
    </li>
  )
}
