# Duet Code

Duet Code というサービスは、① プライベートで書いたコードをレビューしてもらう機会がない問題 ② 他人の書いたコードを読んだり、自分の書いたコードに意見を貰うことで、技術力を上げたいニーズを解決したいコードレビューを通して技術力を上げたい人向けの、ユーザー間のコードレビューサービスです。ユーザーはレビューしてほしいプルリクエストを投稿し、ユーザー登録でレビュイーにもレビュアーにもなることができ、MENTA でお金を払ってレビューしてもらうのとは違って、無料でレビュイーにもレビュアーにもなれる機能が備わっている事が特徴です。

▼ サービス URL

https://www.duet-code.com

▼ 記事

https://zenn.dev/daiki03810218/articles/f3af2e5ff4455b

▼ 技術スタック

https://fbc-stack.vercel.app/posts/duet_code

![duet-code](https://user-images.githubusercontent.com/98577773/208648086-e240b1db-e9f1-41da-8ec1-5930b2f1f7c6.png)

## 使用技術

### バックエンド

- [Ruby on Rails (API モード)](https://rubyonrails.org/)

### フロントエンド

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MUI](https://mui.com/)

※API 関連のコードは[OpenAPI Generator TypeScript Axios](https://openapi-generator.tech/)で自動生成しています。

### インフラ

- バックエンド
  - [Fly.io](https://fly.io/)
- フロントエンド
  - [Vercel](https://vercel.com/)

### テスト

- API テスト
  - [committee-rails](https://github.com/willnet/committee-rails) + [RSpec](https://github.com/rspec)
- E2E テスト
  - [Cypress](https://www.cypress.io/)

### CI/CD

- [GitHub Actions](https://docs.github.com/ja/actions)

※[Lefthook](https://github.com/evilmartians/lefthook)を使用してコミット前に[ESLint](https://eslint.org/)、[Prettier](https://prettier.io/)、[RuboCop](https://github.com/rubocop/rubocop)を実行し、コードの品質を保っています。

### 環境構築

- [Docker](https://www.docker.com/)

### 外部サービス

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [GitHub API](https://docs.github.com/ja/rest)

## 環境構築

```
$ git clone https://github.com/daiki0381/duet-code.git
$ cd duet-code
$ docker-compose build
$ docker-compose run --rm frontend yarn install
$ docker-compose up
```

※Docker を使用する場合、[Docker Desktop](https://www.docker.com/products/docker-desktop/)のダウンロードが必要です。

### 環境変数

#### Firebase Authentication を使用する場合、下記の環境変数を設定してください。

frontend/app/.env.local に設定してください。.env.local の記述方法は frontend/app/.env.local.example を参考にしてください。

| 環境変数名                          |
| ----------------------------------- |
| FIREBASE_CLIENT_EMAIL               |
| NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN    |
| NEXT_PUBLIC_FIREBASE_DATABASE_URL   |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID     |
| FIREBASE_PRIVATE_KEY                |
| COOKIE_SECRET_CURRENT               |
| COOKIE_SECRET_PREVIOUS              |
| NEXT_PUBLIC_COOKIE_SECURE           |

#### Cypress を使用する場合、下記の環境変数・JSON を設定してください。

frontend/app/cypress.env.json に設定してください。cypress.env.json の記述方法は frontend/app/cypress.env.json.example を参考にしてください。

| 環境変数名                   |
| ---------------------------- |
| FIREBASE_API_KEY             |
| FIREBASE_AUTH_DOMAIN         |
| FIREBASE_DATABASE_URL        |
| FIREBASE_PROJECT_ID          |
| FIREBASE_STORAGE_BUCKET      |
| FIREBASE_MESSAGING_SENDER_ID |
| FIREBASE_APP_ID              |
| TEST_UID                     |

frontend/app/serviceAccount.json に設定してください。serviceAccount.json の記述方法は frontend/app/serviceAccount.json.example を参考にしてください。

| JSON 名                     |
| --------------------------- |
| type                        |
| project_id                  |
| private_key_id              |
| private_key                 |
| client_email                |
| client_id                   |
| auth_uri                    |
| token_uri                   |
| auth_provider_x509_cert_url |
| client_x509_cert_url        |

## テスト・リント

### バックエンド

リントの実行

```
$ docker-compose run --rm backend bundle exec rubocop
```

API テストの実行

```
$ docker-compose run --rm backend bundle exec rspec
```

### フロントエンド

リントの実行

```
$ docker-compose run --rm frontend yarn lint-all
```

E2E テストの実行

```
$ cd frontend/app
$ yarn dev
$ yarn cypress:run
```
