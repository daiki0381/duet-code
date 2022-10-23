# frozen_string_literal: true

class User < ApplicationRecord
  has_many :review_posts_about_reviewee,
           class_name: 'ReviewPost',
           foreign_key: 'reviewee_id',
           inverse_of: 'reviewee',
           dependent: :destroy

  has_many :review_posts_about_reviewer,
           class_name: 'ReviewPost',
           foreign_key: 'reviewer_id',
           inverse_of: 'reviewer',
           dependent: :destroy
end
