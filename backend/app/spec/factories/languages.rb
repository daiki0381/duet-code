# frozen_string_literal: true

FactoryBot.define do
  factory :language do
    sequence(:name) { |n| "name#{n}" }
  end
end
