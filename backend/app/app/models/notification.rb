# frozen_string_literal: true

class Notification < ApplicationRecord
  belongs_to :review
  belongs_to :sender, class_name: 'User', optional: true
  belongs_to :receiver, class_name: 'User', optional: true
end
