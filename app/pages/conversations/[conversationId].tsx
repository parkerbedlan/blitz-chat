import { ChevronLeftIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react"
import deleteConversation from "app/conversations/mutations/deleteConversation"
import getConversation from "app/conversations/queries/getConversation"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { Wrapper } from "app/core/components/Wrapper"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import { MessagesList } from "app/messages/components/MessagesList"
import { NewMessageForm } from "app/messages/components/NewMessageForm"
import {
  AuthorizationError,
  BlitzPage,
  Head,
  Link,
  Routes,
  useMutation,
  useParam,
  useQuery,
  useRouter,
} from "blitz"
import { Suspense } from "react"
import { userListToString } from "."

export const Conversation = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()!
  const conversationId = useParam("conversationId", "number")
  const [deleteConversationMutation] = useMutation(deleteConversation)
  const [conversation] = useQuery(getConversation, { id: conversationId })

  const userEmails = Object.fromEntries(
    conversation.users.map((user) => [user.user.id, user.user.email])
  )

  if (!(currentUser.id in userEmails))
    throw new AuthorizationError("You are not a part of this conversation.")

  const conversationTitle = userListToString(
    conversation.users.map((user) => user.user),
    currentUser.id
  )

  return (
    <>
      <Head>
        <title>Conversation with {conversationTitle}</title>
      </Head>

      <Box maxHeight={"15vh"}>
        {/* <pre>{JSON.stringify(conversation, null, 2)}</pre> */}
        <Flex alignItems={"center"}>
          <BlitzChakraLink href={Routes.ConversationsPage()} color={undefined} mr={2}>
            <IconButton size="sm" icon={<ChevronLeftIcon boxSize="5" />} aria-label="Back" />
          </BlitzChakraLink>
          <Flex justifyContent={"space-between"} w={"100%"}>
            <Text fontSize={"3xl"}>{conversationTitle}</Text>
            <IconButton
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete this conversation?")) {
                  await deleteConversationMutation({ id: conversation.id })
                  router.push(Routes.ConversationsPage())
                }
              }}
              colorScheme={"red"}
              icon={<DeleteIcon />}
              size={"xs"}
              opacity={0.7}
              aria-label="Delete Conversation"
            />
          </Flex>
        </Flex>
      </Box>
      <Flex
        direction="column"
        justifyContent={"space-between"}
        wrap={"nowrap"}
        m="1em"
        border="solid"
        height={"85vh"}
      >
        <MessagesList conversationId={conversationId!} userEmails={userEmails} />
        <br />
        <NewMessageForm conversationId={conversationId!} />
      </Flex>
    </>
  )
}

const ShowConversationPage: BlitzPage = () => {
  return (
    <Wrapper variant="regular">
      <Suspense fallback={<div>Loading...</div>}>
        <Conversation />
      </Suspense>
    </Wrapper>
  )
}

ShowConversationPage.authenticate = true
ShowConversationPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowConversationPage
