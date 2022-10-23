# frozen_string_literal: true

class Language < ApplicationRecord
  has_many :review_post_languages, dependent: :destroy
  has_many :review_posts, through: :review_post_languages
end
