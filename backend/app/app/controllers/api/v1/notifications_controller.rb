# frozen_string_literal: true

module Api
  module V1
    class NotificationsController < ApplicationController
      def update
        @notification = Notification.find(params[:id])
        if @notification.update(checked: true)
          render json: @notification, status: :ok
        else
          render status: :unprocessable_entity
        end
      end
    end
  end
end
