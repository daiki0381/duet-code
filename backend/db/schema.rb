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

ActiveRecord::Schema[7.0].define(version: 2022_10_29_053005) do
  create_table "languages", charset: "utf8mb4", force: :cascade do |t|
    t.string "name", comment: "言語名"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notifications", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "review_id"
    t.bigint "sender_id"
    t.bigint "receiver_id"
    t.string "action", comment: "通知の種類"
    t.boolean "checked", default: false, comment: "通知を確認したかどうか"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["receiver_id"], name: "index_notifications_on_receiver_id"
    t.index ["review_id"], name: "index_notifications_on_review_id"
    t.index ["sender_id"], name: "index_notifications_on_sender_id"
  end

  create_table "review_languages", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "review_id"
    t.bigint "language_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["language_id"], name: "index_review_languages_on_language_id"
    t.index ["review_id"], name: "index_review_languages_on_review_id"
  end

  create_table "reviews", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "reviewee_id"
    t.bigint "reviewer_id"
    t.string "title", comment: "タイトル"
    t.string "pull_request_title", comment: "プルリクエストのタイトル"
    t.string "pull_request_url", comment: "プルリクエストのURL"
    t.text "pull_request_description", comment: "プルリクエストの説明"
    t.text "review_point", comment: "レビューしてほしい点"
    t.text "feedback", comment: "フィードバック"
    t.text "thanks", comment: "お礼"
    t.datetime "accepted_at", precision: nil, comment: "レビューする側の承諾日時"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reviewee_id"], name: "index_reviews_on_reviewee_id"
    t.index ["reviewer_id"], name: "index_reviews_on_reviewer_id"
  end

  create_table "users", charset: "utf8mb4", force: :cascade do |t|
    t.string "uid", comment: "Firebase AuthenticationのGitHub認証のユーザー識別子"
    t.string "github_access_token", comment: "GitHubのアクセストークン"
    t.string "name", comment: "ユーザー名"
    t.string "avatar", comment: "アバター画像"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "notifications", "reviews"
  add_foreign_key "notifications", "users", column: "receiver_id"
  add_foreign_key "notifications", "users", column: "sender_id"
  add_foreign_key "review_languages", "languages"
  add_foreign_key "review_languages", "reviews"
  add_foreign_key "reviews", "users", column: "reviewee_id"
  add_foreign_key "reviews", "users", column: "reviewer_id"
end
