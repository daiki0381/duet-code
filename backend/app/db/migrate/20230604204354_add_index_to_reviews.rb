class AddIndexToReviews < ActiveRecord::Migration[7.0]
  def change
    add_index :reviews, [:reviewee_id, :created_at]
    add_index :reviews, [:reviewer_id, :created_at]
  end
end
