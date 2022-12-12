# frozen_string_literal: true

module Api
  module V1
    class WantedReviewsController < ApplicationController
      def index
        @user = User.find(params[:user_id])
        @wanted_reviews = Review.where(reviewee_id: @user.id).order(created_at: :desc)
      end
    end
  end
end
