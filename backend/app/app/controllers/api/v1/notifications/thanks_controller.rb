# frozen_string_literal: true

module Api
  module V1
    module Notifications
      class ThanksController < ApplicationController
        def create
          @review = Review.find(params[:review_id])
          @notification = Notification.new(review_id: @review.id, sender_id: @review.reviewee_id,
                                           receiver_id: @review.reviewer_id, action: 'thanks')
          if @notification.save
            render json: @notification, status: :created
          else
            render status: :unprocessable_entity
          end
        end
      end
    end
  end
end
