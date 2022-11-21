class CreateLanguages < ActiveRecord::Migration[7.0]
  def change
    create_table :languages do |t|
      t.string :name, comment: '言語名'

      t.timestamps
    end
  end
end
