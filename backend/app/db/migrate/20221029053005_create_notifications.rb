class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.references :review, foreign_key: true
      t.references :sender, foreign_key: { to_table: 'users' }
      t.references :receiver, foreign_key: { to_table: 'users' }
      t.string :action, comment: '通知の種類'
      t.boolean :checked, default: false, comment: '通知を確認したかどうか'

      t.timestamps
    end
  end
end
