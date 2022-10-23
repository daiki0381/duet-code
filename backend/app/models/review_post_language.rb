# frozen_string_literal: true

class ReviewPostLanguage < ApplicationRecord
  belongs_to :review_post
  belongs_to :language
end
