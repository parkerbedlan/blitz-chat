import { useSocketStore } from "app/core/hooks/useSocketStore"
import { useMutation } from "blitz"
import createMessage from "../mutations/createMessage"
import { FORM_ERROR, MessageForm } from "./MessageForm"

export const NewMessageForm = ({ conversationId }: { conversationId: number }) => {
  const [createMessageMutation] = useMutation(createMessage)
  const socket = useSocketStore((state) => state.socket)

  return (
    <>
      <MessageForm
        submitText="Create Message"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateMessage}
        initialValues={{ text: "" }}
        onSubmit={async (values, { resetForm }) => {
          try {
            const message = await createMessageMutation({
              ...values,
              conversationId: conversationId!,
            })
            resetForm()
            console.log("emitting new-message", message)
            socket?.emit("new-message", message)
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </>
  )
}
