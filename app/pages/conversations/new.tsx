import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createConversation from "app/conversations/mutations/createConversation"
import { ConversationForm, FORM_ERROR } from "app/conversations/components/ConversationForm"

const NewConversationPage: BlitzPage = () => {
  const router = useRouter()
  const [createConversationMutation] = useMutation(createConversation)

  return (
    <div>
      <h1>Create New Conversation</h1>

      <ConversationForm
        submitText="Create Conversation"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateConversation}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const conversation = await createConversationMutation(values)
            router.push(Routes.ShowConversationPage({ conversationId: conversation.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.ConversationsPage()}>
          <a>Conversations</a>
        </Link>
      </p>
    </div>
  )
}

NewConversationPage.authenticate = true
NewConversationPage.getLayout = (page) => <Layout title={"Create New Conversation"}>{page}</Layout>

export default NewConversationPage
