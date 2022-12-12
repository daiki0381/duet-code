# frozen_string_literal: true

module Api
  module V1
    class AcceptedReviewsController < ApplicationController
      def index
        @user = User.find(params[:user_id])
        @accepted_reviews = Review.where(reviewer_id: @user.id).order(created_at: :desc)
      end
    end
  end
end
