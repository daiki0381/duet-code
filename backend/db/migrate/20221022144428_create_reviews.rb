class CreateReviews < ActiveRecord::Migration[6.1]
  def change
    create_table :reviews do |t|
      t.references :reviewee, foreign_key: { to_table: 'users' }
      t.references :reviewer, foreign_key: { to_table: 'users' }
      t.string :title, comment: 'タイトル'
      t.string :repository, comment: 'リポジトリ'
      t.string :pull_request_title, comment: 'プルリクエストのタイトル'
      t.string :pull_request_url, comment: 'プルリクエストのURL'
      t.text :pull_request_description, comment: 'プルリクエストの説明'
      t.text :review_point, comment: 'レビューしてほしい点'
      t.text :feedback, comment: 'フィードバック'
      t.text :thanks, comment: 'お礼'
      t.datetime :accepted_at, comment: 'レビューする側の承諾日時'

      t.timestamps
    end
  end
end
