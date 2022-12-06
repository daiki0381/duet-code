# frozen_string_literal: true

module Api
  module V1
    module CurrentUser
      class NotificationsController < ApplicationController
        before_action :authenticate_user

        def index
          @notifications =
            Notification.where(receiver_id: current_user.id).order(created_at: 'DESC').map do |notification|
              {
                id: notification.id,
                review_id: notification.review_id,
                sender: {
                  id: notification.sender_id,
                  name: User.find(notification.sender_id).name,
                  avatar: User.find(notification.sender_id).avatar
                },
                receiver: {
                  id: notification.receiver_id,
                  name: User.find(notification.receiver_id).name,
                  avatar: User.find(notification.receiver_id).avatar
                },
                action: notification.action,
                checked: notification.checked,
                created_at: notification.created_at,
                updated_at: notification.updated_at
              }
            end
          render json: @notifications, status: :ok
        end
      end
    end
  end
end
