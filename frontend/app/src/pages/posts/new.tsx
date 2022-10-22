/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { auth } from '@/firebase'
import { userApi } from '@/openapi-generator/user'
import { postApi } from '@/openapi-generator/post'

const New: NextPage = () => {
  type Pull = {
    title: string
    url: string
  }

  type FormData = {
    title: string
    pull_request: string
    languages: string[]
    pull_request_description: string
    review_point: string
  }

  const languages = [
    'Ruby',
    'Ruby on Rails',
    'PHP',
    'Laravel',
    'Python',
    'Django',
    'Go',
    'Gin',
    'Java',
    'Spring Boot',
    'C#',
    'C/C++',
    'HTML/CSS',
    'JavaScript',
    'TypeScript',
    'jQuery',
    'Angular',
    'Vue.js',
    'React',
    'Node.js',
    'Express',
    'NestJS',
    'Next.js',
    'Nuxt.js',
    'Swift',
    'Objective-C',
    'Kotlin',
    'Flutter',
    'React Native',
    'Dart',
    'その他',
  ]

  const [user, loading] = useAuthState(auth)
  const [userId, setUserId] = useState<number | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(
    null,
  )
  const [publicRepos, setPublicRepos] = useState<string[] | []>([])
  const [pulls, setPulls] = useState<Pull[] | []>([])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const getUserId = async (): Promise<void> => {
    const response = await userApi.getCurrentUserId()
    setUserId(response.data)
  }

  const getNameAndGithubAccessToken = async (): Promise<void> => {
    if (userId !== null) {
      const response = await userApi.getUser(userId)
      setName(response.data.name)
      setGithubAccessToken(response.data.github_access_token)
    }
  }

  const getPublicRepos = async (): Promise<void> => {
    if (name !== null && githubAccessToken !== null) {
      const response = await axios.get(
        `https://api.github.com/users/${name}/repos`,
        {
          headers: {
            Authorization: `token ${githubAccessToken}`,
          },
        },
      )
      const publicRepos = response.data.map(
        (repo: { name: string }) => repo.name,
      )
      setPublicRepos(publicRepos)
    }
  }

  const getPulls = async (): Promise<void> => {
    if (
      name !== null &&
      githubAccessToken !== null &&
      publicRepos.length !== 0
    ) {
      const nestedPulls = await Promise.all(
        publicRepos.map(async (repo) => {
          const response = await axios.get(
            `https://api.github.com/repos/${name}/${repo}/pulls`,
            {
              headers: {
                Authorization: `token ${githubAccessToken}`,
              },
            },
          )
          return response.data
        }),
      )
      const pulls = nestedPulls
        .flat()
        .map(
          (pull: {
            title: string
            base: { repo: { name: string } }
            html_url: string
          }) => ({
            title: `${pull.base.repo.name}/${pull.title}`,
            url: pull.html_url,
          }),
        )
      setPulls(pulls)
    }
  }

  useEffect(() => {
    if (user !== null) {
      getUserId().catch((error) => console.error(error))
    }
  }, [user])

  useEffect(() => {
    if (userId !== null) {
      getNameAndGithubAccessToken().catch((error) => {
        console.error(error)
      })
    }
  }, [userId])

  useEffect(() => {
    if (name !== null) {
      getPublicRepos().catch((error) => {
        console.error(error)
      })
    }
  }, [name])

  useEffect(() => {
    if (publicRepos.length !== 0) {
      getPulls().catch((error) => {
        console.error(error)
      })
    }
  }, [publicRepos])

  const onSubmit = handleSubmit(async (data) => {
    const pull = pulls.find((pull) => pull.title === data.pull_request)
    if (pull !== undefined) {
      await postApi.createPost({
        title: data.title,
        pull_request_title: pull.title,
        pull_request_url: pull.url,
        languages: data.languages,
        pull_request_description: data.pull_request_description,
        review_point: data.review_point,
      })
    }
    reset()
  })

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Rubyのレビューをお願いします"
          {...register('title', { required: 'titleを入力してください' })}
        />
        {errors.title !== undefined && <p>{errors.title.message}</p>}
        <select
          placeholder="ruby-practices/ボウリングのスコア計算オブジェクト指向版"
          {...register('pull_request', {
            required: 'プルリクエストを選択してください',
          })}
        >
          {pulls.map((pull) => (
            <option key={pull.title} value={pull.title}>
              {pull.title}
            </option>
          ))}
        </select>
        {errors.pull_request !== undefined && (
          <p>{errors.pull_request.message}</p>
        )}
        <select
          placeholder="Ruby"
          multiple
          {...register('languages', {
            required: '使用言語を選択してください',
          })}
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        {errors.languages !== undefined && <p>{errors.languages.message}</p>}
        <textarea
          placeholder="ボウリングのスコア計算をオブジェクト指向プログラミングで書きました。"
          {...register('pull_request_description', {
            required: 'プルリクエストの説明を入力してください',
          })}
        ></textarea>
        {errors.pull_request_description !== undefined && (
          <p>{errors.pull_request_description.message}</p>
        )}
        <textarea
          placeholder="メソッド/変数の命名"
          {...register('review_point', {
            required: 'レビューしてほしい点を入力してください',
          })}
        ></textarea>
        {errors.review_point !== undefined && (
          <p>{errors.review_point.message}</p>
        )}
        <button>送信</button>
      </form>
    </>
  )
}

export default New
