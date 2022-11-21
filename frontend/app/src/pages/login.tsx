import type { NextPage } from 'next'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import PreLoginHeader from '@/components/organisms/PreLoginHeader'
import Top from '@/components/templates/Top'
import PreLoginFooter from '@/components/organisms/PreLoginFooter'

const Login: NextPage<any> = () => {
  return (
    <>
      <PreLoginHeader />
      <Top />
      <PreLoginFooter />
    </>
  )
}

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Login)
