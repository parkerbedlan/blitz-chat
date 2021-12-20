import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getConversations from "app/conversations/queries/getConversations"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 100

export const ConversationsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ conversations, hasMore }] = usePaginatedQuery(getConversations, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const currentUser = useCurrentUser()!

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {conversations.map((conversation) => {
          const display = userListToString(
            conversation.users.map((user) => user.user),
            currentUser.id
          )
          return (
            <li key={conversation.id}>
              <Link href={Routes.ShowConversationPage({ conversationId: conversation.id })}>
                <a>{display}</a>
              </Link>
            </li>
          )
        })}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const ConversationsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Conversations</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewConversationPage()}>
            <a>Create Conversation</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ConversationsList />
        </Suspense>
      </div>
    </>
  )
}

export const userListToString = (
  users: {
    email: string
    id: number
  }[],
  currentUserId: number
) =>
  users
    .filter((member) => member.id !== currentUserId)
    .map((member) => member.email)
    .join(", ")

ConversationsPage.authenticate = true
ConversationsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ConversationsPage
