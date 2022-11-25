# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:uid) { |n| "uid#{n}" }
    sequence(:github_access_token) { |n| "github_access_token#{n}" }
    sequence(:name) { |n| "name#{n}" }
    sequence(:avatar) { |n| "avatar#{n}" }
  end
end
