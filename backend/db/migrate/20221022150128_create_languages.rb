class CreateLanguages < ActiveRecord::Migration[7.0]
  def change
    create_table :languages do |t|
      t.string :language, comment: '使用言語'

      t.timestamps
    end
  end
end
