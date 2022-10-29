# frozen_string_literal: true

module Api
  module V1
    class NotificationsController < ApplicationController
      before_action :authenticate_user, only: %i[current_user_notifications]

      def current_user_notifications
        @notifications = Notification.where(receiver_id: current_user.id)
        render json: @notifications, status: :ok
      end

      def create_accepted_notification
        @review = Review.find(params[:id])
        @notification = Notification.new(review_id: @review.id, sender_id: @review.reviewer_id,
                                         receiver_id: @review.reviewee_id, action: 'accepted')
        if @notification.save
          render json: @notification, status: :created
        else
          render status: :unprocessable_entity
        end
      end

      def create_feedback_notification
        @review = Review.find(params[:id])
        @notification = Notification.new(review_id: @review.id, sender_id: @review.reviewer_id,
                                         receiver_id: @review.reviewee_id, action: 'feedback')
        if @notification.save
          render json: @notification, status: :created
        else
          render status: :unprocessable_entity
        end
      end

      def create_thanks_notification
        @review = Review.find(params[:id])
        @notification = Notification.new(review_id: @review.id, sender_id: @review.reviewee_id,
                                         receiver_id: @review.reviewer_id, action: 'thanks')
        if @notification.save
          render json: @notification, status: :created
        else
          render status: :unprocessable_entity
        end
      end

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
