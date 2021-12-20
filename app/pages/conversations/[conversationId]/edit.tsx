import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getConversation from "app/conversations/queries/getConversation"
import updateConversation from "app/conversations/mutations/updateConversation"
import { ConversationForm, FORM_ERROR } from "app/conversations/components/ConversationForm"

export const EditConversation = () => {
  const router = useRouter()
  const conversationId = useParam("conversationId", "number")
  const [conversation, { setQueryData }] = useQuery(
    getConversation,
    { id: conversationId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateConversationMutation] = useMutation(updateConversation)

  return (
    <>
      <Head>
        <title>Edit Conversation {conversation.id}</title>
      </Head>

      <div>
        <h1>Edit Conversation {conversation.id}</h1>
        <pre>{JSON.stringify(conversation, null, 2)}</pre>

        <ConversationForm
          submitText="Update Conversation"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateConversation}
          initialValues={conversation}
          onSubmit={async (values) => {
            try {
              const updated = await updateConversationMutation({
                id: conversation.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowConversationPage({ conversationId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditConversationPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditConversation />
      </Suspense>

      <p>
        <Link href={Routes.ConversationsPage()}>
          <a>Conversations</a>
        </Link>
      </p>
    </div>
  )
}

EditConversationPage.authenticate = true
EditConversationPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditConversationPage
