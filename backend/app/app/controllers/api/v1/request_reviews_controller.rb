# frozen_string_literal: true

module Api
  module V1
    class RequestReviewsController < ApplicationController
      def create
        @review = Review.find(params[:review_id])
        @reviewee = User.find(@review.reviewee_id)
        @reviewer = User.find(@review.reviewer_id)
        @review.add_reviewer(@reviewee, @reviewer)
        render json: { status_code: 201, status: 'created' }, status: :created
      end
    end
  end
end
