import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createConversation from "app/conversations/mutations/createConversation"
import { ConversationForm, FORM_ERROR } from "app/conversations/components/ConversationForm"
import { CreateConversation } from "app/auth/validations"
import { Wrapper } from "app/core/components/Wrapper"
import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { ChevronLeftIcon } from "@chakra-ui/icons"

const NewConversationPage: BlitzPage = () => {
  const router = useRouter()
  const [createConversationMutation] = useMutation(createConversation)

  return (
    <Wrapper variant="small">
      <Flex alignItems={"center"} mb={2}>
        <BlitzChakraLink href={Routes.ConversationsPage()} color={undefined}>
          <IconButton
            size="sm"
            icon={<ChevronLeftIcon boxSize={"5"} />}
            aria-label="Back"
            textAlign={"center"}
            mr={4}
          />
        </BlitzChakraLink>
        <Text fontSize={"2xl"}>Create New Conversation</Text>
      </Flex>

      <ConversationForm
        submitText="Create Conversation"
        schema={CreateConversation}
        initialValues={{ email: "" }}
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
    </Wrapper>
  )
}

NewConversationPage.authenticate = true
NewConversationPage.getLayout = (page) => <Layout title={"Create New Conversation"}>{page}</Layout>

export default NewConversationPage
