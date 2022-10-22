class CreatePostLanguages < ActiveRecord::Migration[7.0]
  def change
    create_table :post_languages do |t|
      t.references :post, foreign_key: true
      t.references :language, foreign_key: true

      t.timestamps
    end
  end
end
