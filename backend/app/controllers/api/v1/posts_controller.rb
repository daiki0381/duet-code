# frozen_string_literal: true

module Api
  module V1
    class PostsController < ApplicationController
      before_action :authenticate_user, only: %i[create]

      def index; end

      def show; end

      def create
        id = current_user.id
        title = params[:title]
        review_point = params[:review_point]
        pull_request_title = params[:pull_request_title]
        pull_request_url = params[:pull_request_url]
        pull_request_description = params[:pull_request_description]
        post_params = { reviewee_id: id, title: title, review_point: review_point }
        pull_request_params = { pull_request_title: pull_request_title, pull_request_url: pull_request_url,
                                pull_request_description: pull_request_description }
        @post = Post.new(post_params.merge(pull_request_params))
        if @post.save
          params[:languages].each do |language|
            @post.languages.create(language: language)
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
