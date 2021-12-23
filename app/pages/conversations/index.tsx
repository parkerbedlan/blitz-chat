import { Suspense } from "react"
import { Head, Link as BlitzLink, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getConversations from "app/conversations/queries/getConversations"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Wrapper } from "app/core/components/Wrapper"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { Box, Button, Flex, Text } from "@chakra-ui/react"

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
      <Box m={4}>
        <hr />
        {conversations.map((conversation, index) => {
          const display = userListToString(
            conversation.users.map((user) => user.user),
            currentUser.id
          )
          return (
            <BlitzChakraLink
              key={conversation.id}
              href={Routes.ShowConversationPage({ conversationId: conversation.id })}
              color={undefined}
            >
              <Box w={"100%"} border="1px" borderTop={index !== 0 ? "none" : undefined} p={4}>
                {display}
              </Box>
            </BlitzChakraLink>
          )
        })}
      </Box>

      <Button disabled={page === 0} onClick={goToPreviousPage} size="sm">
        Previous
      </Button>
      <Button disabled={!hasMore} onClick={goToNextPage} ml={2} size="sm">
        Next
      </Button>
    </div>
  )
}

const ConversationsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Conversations</title>
      </Head>

      <Wrapper>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize="2xl">Your Conversations</Text>
          <BlitzChakraLink href={Routes.NewConversationPage()} color={undefined}>
            <Button size={"sm"} colorScheme={"purple"}>
              Start New Conversation
            </Button>
          </BlitzChakraLink>
        </Flex>

        <Suspense fallback={<div>Loading...</div>}>
          <ConversationsList />
        </Suspense>
      </Wrapper>
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
