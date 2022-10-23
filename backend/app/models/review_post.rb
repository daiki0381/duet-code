# frozen_string_literal: true

class ReviewPost < ApplicationRecord
  belongs_to :reviewee, class_name: 'User', optional: true
  belongs_to :reviewer, class_name: 'User', optional: true
  has_many :review_post_languages, dependent: :destroy
  has_many :languages, through: :review_post_languages
end
