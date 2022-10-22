# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_10_22_150138) do
  create_table "languages", charset: "utf8mb4", force: :cascade do |t|
    t.string "language", comment: "使用言語"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "post_languages", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "post_id"
    t.bigint "language_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["language_id"], name: "index_post_languages_on_language_id"
    t.index ["post_id"], name: "index_post_languages_on_post_id"
  end

  create_table "posts", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "reviewee_id"
    t.bigint "reviewer_id"
    t.string "title", comment: "タイトル"
    t.string "pull_request_title", comment: "プルリクエストのタイトル"
    t.string "pull_request_url", comment: "プルリクエストのURL"
    t.text "pull_request_description", comment: "プルリクエストの説明"
    t.text "review_point", comment: "レビューしてほしい点"
    t.text "feedback", comment: "フィードバック"
    t.text "thanks", comment: "お礼"
    t.boolean "done", default: false, comment: "募集を終了しているか"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reviewee_id"], name: "index_posts_on_reviewee_id"
    t.index ["reviewer_id"], name: "index_posts_on_reviewer_id"
  end

  create_table "users", charset: "utf8mb4", force: :cascade do |t|
    t.string "uid", comment: "Firebase AuthenticationのGitHub認証のユーザー識別子"
    t.string "github_access_token", comment: "GitHubのアクセストークン"
    t.string "name", comment: "ユーザー名"
    t.string "avatar", comment: "アバター画像"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "post_languages", "languages"
  add_foreign_key "post_languages", "posts"
  add_foreign_key "posts", "users", column: "reviewee_id"
  add_foreign_key "posts", "users", column: "reviewer_id"
end
