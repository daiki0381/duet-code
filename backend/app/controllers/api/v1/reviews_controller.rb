# frozen_string_literal: true

module Api
  module V1
    class ReviewsController < ApplicationController
      before_action :authenticate_user, only: %i[create]

      def index
        @reviews = Review.all.map do |review|
          languages = review.languages.map(&:name)
          {
            id: review.id,
            reviewee_id: review.reviewee_id,
            reviewer_id: review.reviewer_id,
            title: review.title,
            repository: review.repository,
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
        render json: @reviews, status: :ok
      end

      def show; end

      def create
        user_id = current_user.id
        title = params[:title]
        review_point = params[:review_point]
        repository = params[:repository]
        pull_request_title = params[:pull_request_title]
        pull_request_url = params[:pull_request_url]
        pull_request_description = params[:pull_request_description]
        review_params = { reviewee_id: user_id, title: title, repository: repository, review_point: review_point }
        pull_request_params = { pull_request_title: pull_request_title, pull_request_url: pull_request_url,
                                pull_request_description: pull_request_description }
        @review = Review.new(review_params.merge(pull_request_params))
        if @review.save
          params[:languages].each do |language|
            @review.languages.create(name: language)
          end
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end

      def update; end

      def destroy; end
    end
  end
end
