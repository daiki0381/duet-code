# frozen_string_literal: true

class Review < ApplicationRecord
  belongs_to :reviewee, class_name: 'User', optional: true
  belongs_to :reviewer, class_name: 'User', optional: true
  has_many :review_languages, dependent: :destroy
  has_many :languages, through: :review_languages
end
