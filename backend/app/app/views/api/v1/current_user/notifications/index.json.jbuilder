# frozen_string_literal: true

json.array! @notifications do |notification|
  json.id notification.id
  json.review_id notification.review_id
  json.sender do
    json.id notification.sender_id
    json.name User.find(notification.sender_id).name
    json.avatar_url User.find(notification.sender_id).avatar
  end
  json.receiver do
    json.id notification.receiver_id
    json.name User.find(notification.receiver_id).name
    json.avatar_url User.find(notification.receiver_id).avatar
  end
  json.action notification.action
  json.checked notification.checked
  json.created_at notification.created_at
  json.updated_at notification.updated_at
end
