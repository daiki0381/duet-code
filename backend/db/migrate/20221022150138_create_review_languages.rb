class CreateReviewLanguages < ActiveRecord::Migration[7.0]
  def change
    create_table :review_languages do |t|
      t.references :review, foreign_key: true
      t.references :language, foreign_key: true

      t.timestamps
    end
  end
end
