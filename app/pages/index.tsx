import { Suspense } from "react"
import { Image, Link as BlitzLink, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import logo from "public/logo.png"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { Box, Button, Flex, Text } from "@chakra-ui/react"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <Box m={2}>
          <BlitzLink href={Routes.ConversationsPage()}>
            <Button colorScheme={"purple"}>Conversations</Button>
          </BlitzLink>
          <Button
            onClick={async () => {
              await logoutMutation()
            }}
            variant="outline"
            colorScheme={"red"}
            ml={2}
          >
            Logout
          </Button>
        </Box>
        <Box mt={2}>
          <Text>
            User id: <code>{currentUser.id}</code>
          </Text>
          <Text>
            User role: <code>{currentUser.role}</code>
          </Text>
        </Box>
      </>
    )
  } else {
    return (
      <Box>
        <Button colorScheme={"purple"}>
          <BlitzLink href={Routes.SignupPage()}>Sign Up</BlitzLink>
        </Button>
        <Button ml={4} colorScheme={"purple"}>
          <BlitzLink href={Routes.LoginPage()}>Login</BlitzLink>
        </Button>
      </Box>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <>
      <Flex direction="column" alignItems="center" justifyContent="center" height="100vh">
        <Box w="300px">
          <Image src={logo} alt="blitzjs" />
        </Box>
        <UserInfo />
      </Flex>
    </>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
