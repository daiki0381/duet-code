class AddIndexToNotifications < ActiveRecord::Migration[7.0]
  def change
     add_index :notifications, [:receiver_id, :created_at]
  end
end
