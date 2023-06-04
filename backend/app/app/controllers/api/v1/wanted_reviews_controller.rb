# frozen_string_literal: true

module Api
  module V1
    class WantedReviewsController < ApplicationController
      def index
        @wanted_reviews = Review.where(reviewee_id: @user.id).order(created_at: :desc)
      end
    end
  end
end
