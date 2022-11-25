# frozen_string_literal: true

FactoryBot.define do
  factory :notification do
    association :review
    association :sender, factory: :user
    association :receiver, factory: :user
    action { 'accepted' }
    checked { false }
  end
end
