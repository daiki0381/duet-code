class CreateReviewPostLanguages < ActiveRecord::Migration[7.0]
  def change
    create_table :review_post_languages do |t|
      t.references :review_post, foreign_key: true
      t.references :language, foreign_key: true

      t.timestamps
    end
  end
end
