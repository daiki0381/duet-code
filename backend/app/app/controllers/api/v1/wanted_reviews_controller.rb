# frozen_string_literal: true

module Api
  module V1
    class WantedReviewsController < ApplicationController
      def index
        @wanted_reviews = Review.includes(:reviewee, :reviewer, :languages).where(reviewee_id: params[:user_id]).order(created_at: :desc)
      end
    end
  end
end
