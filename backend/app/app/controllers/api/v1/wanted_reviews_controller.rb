# frozen_string_literal: true

module Api
  module V1
    class WantedReviewsController < ApplicationController
      def index
        @user = User.find(params[:user_id])
        @wanted_reviews = Review.where(reviewee_id: @user.id).order(created_at: 'DESC').map do |review|
          reviewer = review.reviewer_id.nil? ? nil : User.find(review.reviewer_id)
          name = reviewer ? reviewer.name : nil
          avatar = reviewer ? reviewer.avatar : nil
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
              name: name,
              avatar: avatar
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
        render json: @wanted_reviews, status: :ok
      end
    end
  end
end
