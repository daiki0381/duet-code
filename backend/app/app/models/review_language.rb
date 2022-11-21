# frozen_string_literal: true

class ReviewLanguage < ApplicationRecord
  belongs_to :review
  belongs_to :language
end
