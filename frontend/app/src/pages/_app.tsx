import '../styles/globals.css'
import { useState } from 'react'
import { RecoilRoot } from 'recoil'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import initAuth from '@/utils/initAuth'

initAuth()

function MyApp({ Component, pageProps }: any): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </RecoilRoot>
  )
}

export default MyApp
