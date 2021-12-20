import { usePaginatedQuery } from "blitz"
import { useState } from "react"
import getMessages from "../queries/getMessages"

const ITEMS_PER_PAGE = 4

export const MessagesList = ({ conversationId }: { conversationId: number }) => {
  const [page, setPage] = useState(0)
  // const page = Number(router.query.page) || 0
  const [{ messages, hasMore }] = usePaginatedQuery(getMessages, {
    where: { conversation: { id: conversationId! } },
    orderBy: { id: "desc" },
    // skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE * (page + 1),
  })

  const goToNextPage = () => setPage((p) => p + 1)

  return (
    <>
      {/* <pre>{JSON.stringify(messages, null, 2)}</pre> */}
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
                <li key={message.id}>
                  <p>
                    {message.user.email}: {message.text}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  )
}
