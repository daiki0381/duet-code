# frozen_string_literal: true

class Post < ApplicationRecord
  belongs_to :reviewee, class_name: 'User', optional: true
  belongs_to :reviewer, class_name: 'User', optional: true
  has_many :post_languages, dependent: :destroy
  has_many :languages, through: :post_languages
end
