# frozen_string_literal: true

class PostLanguage < ApplicationRecord
  belongs_to :post
  belongs_to :language
end
