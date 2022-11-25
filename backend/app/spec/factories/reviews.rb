# frozen_string_literal: true

FactoryBot.define do
  factory :review do
    association :reviewee, factory: :user
    association :reviewer, factory: :user
    sequence(:title) { |n| "title#{n}" }
    sequence(:pull_request_title) { |n| "pull_request_title#{n}" }
    sequence(:pull_request_url) { |n| "pull_request_url#{n}" }
    sequence(:pull_request_description) { |n| "pull_request_description#{n}" }
    sequence(:review_point) { |n| "review_point#{n}" }
    sequence(:feedback) { |n| "feedback#{n}" }
    sequence(:thanks) { |n| "thanks#{n}" }
    accepted_at { Time.current }
  end
end
