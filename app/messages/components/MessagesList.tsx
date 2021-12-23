import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { Message } from "@prisma/client"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useSocketConnect } from "app/core/hooks/useSocketConnect"
import { usePaginatedQuery } from "blitz"
import { useEffect, useState } from "react"
import getMessages from "../queries/getMessages"

// TODO: make this conditional based on height of user's screen, maybe use ref
const ITEMS_PER_PAGE = 10

export const MessagesList = ({
  conversationId,
  userEmails,
}: {
  conversationId: number
  userEmails: Record<number, string>
}) => {
  const [page, setPage] = useState(0)
  const [{ messages, hasMore }] = usePaginatedQuery(getMessages, {
    where: { conversation: { id: conversationId! } },
    orderBy: { id: "desc" },
    take: ITEMS_PER_PAGE * (page + 1),
  })
  const goToNextPage = () => setPage((p) => p + 1)

  const [liveMessages, setLiveMessages] = useState<Message[]>([])
  const _socket = useSocketConnect({ conversationId }, [
    {
      on: "new-remote-message",
      listener: (data: Message) => {
        console.log("new-remote-message", data)
        setLiveMessages((liveMessages) => [...liveMessages, data])
      },
    },
  ])
  // remove duplicates
  useEffect(() => {
    setLiveMessages((liveMessages) =>
      liveMessages.filter(
        (liveMessage) => !messages.some((message) => message.id === liveMessage.id)
      )
    )
  }, [messages])

  const { id: currentUserId } = useCurrentUser()!

  return (
    <>
      {/* <pre>{JSON.stringify(liveMessages, null, 2)}</pre> */}
      <Box overflowY={"scroll"} display="flex" flexDirection={"column-reverse"} height={"75vh"}>
        <Box>
          {hasMore && (
            <Flex justifyContent={"center"}>
              <Button disabled={!hasMore} onClick={goToNextPage} size="sm" m={2}>
                Load more
              </Button>
            </Flex>
          )}
          <Box>
            {messages
              .slice(0)
              .reverse()
              .map((message) => {
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    email={userEmails[message.userId]!}
                    fromMe={message.userId === currentUserId}
                  />
                )
              })}
            {liveMessages.map((message) => {
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  email={userEmails[message.userId]!}
                  fromMe={message.userId === currentUserId}
                />
              )
            })}
          </Box>
        </Box>
      </Box>
    </>
  )
}

const MessageBubble = ({
  message,
  email,
  fromMe,
}: {
  message: Message
  email: string
  fromMe: boolean
}) => {
  if (!fromMe)
    return (
      <Box m={4}>
        <Text fontSize={"xs"}>{email.split("@")[0]}</Text>
        <Box
          bgColor={"gray.500"}
          color="white"
          px={4}
          py={2}
          borderRadius={"3xl"}
          maxW={"50%"}
          w={"fit-content"}
        >
          {message.text}
        </Box>
      </Box>
    )
  return (
    <Flex m={4} justifyContent={"flex-end"} w={"50%"} ml="auto">
      <Box>
        <Text fontSize={"xs"}>{email.split("@")[0]}</Text>
        <Box
          bgColor={"blue.400"}
          color="white"
          px={4}
          py={2}
          borderRadius={"3xl"}
          w={"fit-content"}
        >
          <Text>{message.text}</Text>
        </Box>
      </Box>
    </Flex>
  )
}
