import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { Wrapper } from "app/core/components/Wrapper"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Wrapper variant="small">
      <SignupForm onSuccess={() => router.push(Routes.Home())} />
    </Wrapper>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
