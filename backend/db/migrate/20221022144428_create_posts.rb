class CreatePosts < ActiveRecord::Migration[6.1]
  def change
    create_table :posts do |t|
      t.references :reviewee, foreign_key: { to_table: 'users' }
      t.references :reviewer, foreign_key: { to_table: 'users' }
      t.string :title, comment: 'タイトル'
      t.string :pull_request_title, comment: 'プルリクエストのタイトル'
      t.string :pull_request_url, comment: 'プルリクエストのURL'
      t.text :pull_request_description, comment: 'プルリクエストの説明'
      t.text :review_point, comment: 'レビューしてほしい点'
      t.text :feedback, comment: 'フィードバック'
      t.text :thanks, comment: 'お礼'
      t.boolean :done, default: false, comment: '募集を終了しているか'

      t.timestamps
    end
  end
end
