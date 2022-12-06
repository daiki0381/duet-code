# frozen_string_literal: true

module Api
  module V1
    class AcceptedReviewsController < ApplicationController
      def index
        @user = User.find(params[:user_id])
        @accepted_reviews = Review.where(reviewer_id: @user.id).order(created_at: 'DESC').map do |review|
          languages = review.languages.map(&:name)
          {
            id: review.id,
            reviewee: {
              id: review.reviewee_id,
              name: User.find(review.reviewee_id).name,
              avatar: User.find(review.reviewee_id).avatar
            },
            reviewer: {
              id: review.reviewer_id,
              name: User.find(review.reviewer_id).name,
              avatar: User.find(review.reviewer_id).avatar
            },
            title: review.title,
            pull_request_title: review.pull_request_title,
            pull_request_url: review.pull_request_url,
            languages: languages,
            pull_request_description: review.pull_request_description,
            review_point: review.review_point,
            feedback: review.feedback,
            thanks: review.thanks,
            accepted_at: review.accepted_at,
            created_at: review.created_at,
            updated_at: review.updated_at
          }
        end
        render json: @accepted_reviews, status: :ok
      end
    end
  end
end
