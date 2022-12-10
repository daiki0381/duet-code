# frozen_string_literal: true

json.array! @accepted_reviews do |review|
  languages = review.languages.map(&:name)

  json.id review.id
  json.reviewee do
    json.id review.reviewee_id
    json.name User.find(review.reviewee_id).name
    json.avatar User.find(review.reviewee_id).avatar
  end
  json.reviewer do
    json.id review.reviewer_id
    json.name User.find(review.reviewer_id).name
    json.avatar User.find(review.reviewer_id).avatar
  end
  json.title review.title
  json.pull_request_title review.pull_request_title
  json.pull_request_url review.pull_request_url
  json.languages languages
  json.pull_request_description review.pull_request_description
  json.review_point review.review_point
  json.feedback review.feedback
  json.thanks review.thanks
  json.accepted_at review.accepted_at
  json.created_at review.created_at
  json.updated_at review.updated_at
end
