import type { NextPage } from 'next'
import Head from 'next/head'
import { withAuthUser, AuthAction } from 'next-firebase-auth'

const NotFound: NextPage<any> = () => {
  return (
    <>
      <Head>
        <title>Duet Code | 404 Not Found</title>
      </Head>
    </>
  )
}

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(NotFound)
