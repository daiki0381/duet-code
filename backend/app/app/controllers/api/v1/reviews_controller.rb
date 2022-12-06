# frozen_string_literal: true

module Api
  module V1
    class ReviewsController < ApplicationController
      before_action :authenticate_user, only: %i[create]

      def index
        @reviews = Review.all.order(created_at: 'DESC').map do |review|
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
        render json: @reviews, status: :ok
      end

      def show
        @review = Review.find(params[:id])
        reviewer = @review.reviewer_id.nil? ? nil : User.find(@review.reviewer_id)
        name = reviewer ? reviewer.name : nil
        avatar = reviewer ? reviewer.avatar : nil
        languages = @review.languages.map(&:name)
        @review = {
          id: @review.id,
          reviewee: {
            id: @review.reviewee_id,
            name: User.find(@review.reviewee_id).name,
            avatar: User.find(@review.reviewee_id).avatar
          },
          reviewer: {
            id: @review.reviewer_id,
            name: name,
            avatar: avatar
          },
          title: @review.title,
          pull_request_title: @review.pull_request_title,
          pull_request_url: @review.pull_request_url,
          languages: languages,
          pull_request_description: @review.pull_request_description,
          review_point: @review.review_point,
          feedback: @review.feedback,
          thanks: @review.thanks,
          accepted_at: @review.accepted_at,
          created_at: @review.created_at,
          updated_at: @review.updated_at
        }
        render json: @review, status: :ok
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
          render status: :created
        else
          render status: :unprocessable_entity
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
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end

      def destroy
        @review = Review.find(params[:id])
        @review.destroy
        render status: :no_content
      end
    end
  end
end
