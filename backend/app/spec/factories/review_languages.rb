# frozen_string_literal: true

FactoryBot.define do
  factory :review_language do
    association :review
    association :language
  end
end
