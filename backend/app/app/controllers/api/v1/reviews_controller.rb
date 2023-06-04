# frozen_string_literal: true

module Api
  module V1
    class ReviewsController < ApplicationController
      before_action :authenticate_user, only: %i[create]

      def index
        @reviews = Review.all.order(created_at: :desc)
      end

      def show
        @review = Review.find(params[:id])
      end

      def create
        user_id = current_user.id
        title = params[:title]
        review_point = params[:review_point]
        pull_request_title = params[:pull_request_title]
        pull_request_url = params[:pull_request_url]
        pull_request_description = params[:pull_request_description]
        review_params = { reviewee_id: user_id, title: title, review_point: review_point }
        pull_request_params = { pull_request_title: pull_request_title, pull_request_url: pull_request_url,
                                pull_request_description: pull_request_description }
        @review = Review.new(review_params.merge(pull_request_params))
        if @review.save
          params[:languages].each do |language|
            @review.languages.create(name: language)
          end
          render json: { status_code: 201, status: 'created' }, status: :created
        else
          render json: { status_code: 422, status: 'unprocessable_entity' }, status: :unprocessable_entity
        end
      end

      def update
        @review = Review.find(params[:id])
        review_params = {
          title: params[:title],
          pull_request_title: params[:pull_request_title],
          pull_request_url: params[:pull_request_url],
          pull_request_description: params[:pull_request_description],
          review_point: params[:review_point]
        }
        if @review.update(review_params)
          @review.languages.destroy_all
          params[:languages].each do |language|
            @review.languages.create(name: language)
          end
          render json: { status_code: 201, status: 'created' }, status: :created
        else
          render json: { status_code: 422, status: 'unprocessable_entity' }, status: :unprocessable_entity
        end
      end

      def destroy
        @review = Review.find(params[:id])
        @review.destroy
        render json: { status_code: 204, status: 'no_content' }, status: :no_content
      end
    end
  end
end
