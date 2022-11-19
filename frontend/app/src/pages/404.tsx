import type { NextPage } from 'next'
import { withAuthUser, AuthAction } from 'next-firebase-auth'

const NotFound: NextPage<any> = () => {
  return <></>
}

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(NotFound)
