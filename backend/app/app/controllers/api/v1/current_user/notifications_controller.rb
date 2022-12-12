# frozen_string_literal: true

module Api
  module V1
    module CurrentUser
      class NotificationsController < ApplicationController
        before_action :authenticate_user

        def index
          @notifications = Notification.where(receiver_id: current_user.id).order(created_at: :desc)
        end
      end
    end
  end
end
