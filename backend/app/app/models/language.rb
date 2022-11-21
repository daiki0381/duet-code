# frozen_string_literal: true

class Language < ApplicationRecord
  has_many :review_languages, dependent: :destroy
  has_many :reviews, through: :review_languages
end
