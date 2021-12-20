import { Suspense, useState } from "react"
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  Routes,
  usePaginatedQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getConversation from "app/conversations/queries/getConversation"
import deleteConversation from "app/conversations/mutations/deleteConversation"
import getMessages from "app/messages/queries/getMessages"
import { FORM_ERROR, MessageForm } from "app/messages/components/MessageForm"
import createMessage from "app/messages/mutations/createMessage"
import { MessagesList } from "app/messages/components/MessagesList"
import { NewMessageForm } from "app/messages/components/NewMessageForm"
import { userListToString } from "."
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

export const Conversation = () => {
  const router = useRouter()
  const conversationId = useParam("conversationId", "number")
  const [deleteConversationMutation] = useMutation(deleteConversation)
  const [conversation] = useQuery(getConversation, { id: conversationId })
  const currentUser = useCurrentUser()!

  return (
    <>
      <Head>
        <title>Conversation {conversation.id}</title>
      </Head>

      <div>
        <h1>
          Conversation with{" "}
          {userListToString(
            conversation.users.map((user) => user.user),
            currentUser.id
          )}
        </h1>
        {/* <pre>{JSON.stringify(conversation, null, 2)}</pre> */}

        <Link href={Routes.EditConversationPage({ conversationId: conversation.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteConversationMutation({ id: conversation.id })
              router.push(Routes.ConversationsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
      <div style={{ border: "solid", width: "15em", margin: "1em" }}>
        <MessagesList conversationId={conversationId!} />
      </div>
      <NewMessageForm conversationId={conversationId!} />
    </>
  )
}

const ShowConversationPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ConversationsPage()}>
          <a>Conversations</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Conversation />
      </Suspense>
    </div>
  )
}

ShowConversationPage.authenticate = true
ShowConversationPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowConversationPage
function createMessageMutation(arg0: any) {
  throw new Error("Function not implemented.")
}