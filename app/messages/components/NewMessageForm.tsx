import { Icon, IconButton, Input, InputGroup, InputRightAddon } from "@chakra-ui/react"
import { Form } from "app/core/components/Form"
import { useSocketStore } from "app/core/hooks/useSocketStore"
import { useMutation } from "blitz"
import { useField, useFormikContext } from "formik"
import React from "react"
import createMessage from "../mutations/createMessage"
import { FORM_ERROR } from "./MessageForm"

export const NewMessageForm = ({ conversationId }: { conversationId: number }) => {
  const [createMessageMutation] = useMutation(createMessage)
  const socket = useSocketStore((state) => state.socket)

  return (
    <>
      <Form
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
      >
        <NewMessageField />
      </Form>
    </>
  )
}

const NewMessageField = () => {
  const [textInput] = useField("text")
  const { isSubmitting } = useFormikContext()
  return (
    <InputGroup>
      <Input {...textInput} disabled={isSubmitting} placeholder="Text message" />
      <InputRightAddon as={IconButton} type="submit" bgColor="blue.400">
        {/* <ArrowRightIcon color="white" /> */}
        <SendIcon />
      </InputRightAddon>
    </InputGroup>
  )
}

const SendIcon: React.FC<React.ComponentProps<typeof Icon>> = (props) => (
  <Icon height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF" {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </Icon>
)
