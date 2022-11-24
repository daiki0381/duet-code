import '../styles/globals.css'
import { useState } from 'react'
import Head from 'next/head'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import initAuth from '@/utils/initAuth'

initAuth()

function MyApp({ Component, pageProps }: any): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Duet Code</title>
        <meta
          name="description"
          content="Duet Codeはレビューしてほしいプルリクエストを投稿し、レビュアーを募集できるサービスです。ログインすることでレビュイーにもレビュアーにもなることができます。"
        />
        <meta property="og:title" content="Duet Code" />
        <meta
          property="og:description"
          content="Duet Codeはレビューしてほしいプルリクエストを投稿し、レビュアーを募集できるサービスです。ログインすることでレビュイーにもレビュアーにもなることができます。"
        />
        <meta
          property="og:image"
          content="https://www.duet-code.com/twitter-card.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
