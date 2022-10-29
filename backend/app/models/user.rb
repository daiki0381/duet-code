# frozen_string_literal: true

class User < ApplicationRecord
  has_many :reviews_about_reviewee,
           class_name: 'Review',
           foreign_key: 'reviewee_id',
           inverse_of: 'reviewee',
           dependent: :destroy

  has_many :reviews_about_reviewer,
           class_name: 'Review',
           foreign_key: 'reviewer_id',
           inverse_of: 'reviewer',
           dependent: :destroy
  has_many :notifications_about_sender,
           class_name: 'Notification',
           foreign_key: 'sender_id',
           inverse_of: 'sender',
           dependent: :destroy

  has_many :notifications_about_receiver,
           class_name: 'Notification',
           foreign_key: 'receiver_id',
           inverse_of: 'receiver',
           dependent: :destroy
end
