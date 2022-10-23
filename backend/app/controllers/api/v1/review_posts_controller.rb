# frozen_string_literal: true

module Api
  module V1
    class ReviewPostsController < ApplicationController
      before_action :authenticate_user, only: %i[create]

      def index
        ReviewPost.all.each do |review_post|
          @languages = review_post.languages.map(&:name)
        end
        @review_posts = ReviewPost.all.map(&:attributes)
        @review_posts.each do |review_post|
          review_post['languages'] = @languages
        end
        render json: @review_posts, status: :ok
      end

      def show; end

      def create
        id = current_user.id
        title = params[:title]
        review_point = params[:review_point]
        pull_request_title = params[:pull_request_title]
        pull_request_url = params[:pull_request_url]
        pull_request_description = params[:pull_request_description]
        review_post_params = { reviewee_id: id, title: title, review_point: review_point }
        pull_request_params = { pull_request_title: pull_request_title, pull_request_url: pull_request_url,
                                pull_request_description: pull_request_description }
        @review_post = ReviewPost.new(review_post_params.merge(pull_request_params))
        if @review_post.save
          params[:languages].each do |language|
            @review_post.languages.create(name: language)
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
