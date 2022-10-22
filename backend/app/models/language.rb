# frozen_string_literal: true

class Language < ApplicationRecord
  has_many :post_languages, dependent: :destroy
  has_many :posts, through: :post_languages
end
