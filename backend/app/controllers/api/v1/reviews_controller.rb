# frozen_string_literal: true

require 'date'
require 'octokit'

module Api
  module V1
    class ReviewsController < ApplicationController
      before_action :authenticate_user, only: %i[create accept_review]

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
        reviewer = review.reviewer_id.nil? ? nil : User.find(@review.reviewer_id)
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
          params[:languages].each do |language|
            @review.languages.update(name: language)
          end
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end

      def accept_review
        @review = Review.find(params[:id])
        if @review.update(accepted_at: DateTime.now, reviewer_id: current_user.id)
          @reviewee = User.find(@review.reviewee_id)
          @reviewer = User.find(@review.reviewer_id)
          reviewee = Octokit::Client.new(access_token: @reviewee.github_access_token)
          reviewer = Octokit::Client.new(access_token: @reviewer.github_access_token)
          repository = @review.pull_request_url.split('/')[4]
          name_and_repository = "#{@reviewee.name}/#{repository}"
          reviewee.add_collaborator(name_and_repository, @reviewer.name)
          repository_invitations = reviewee.repository_invitations(name_and_repository)
          reviewer.accept_repository_invitation(repository_invitations[0].id) unless repository_invitations.empty?
          pull_request_number = @review.pull_request_url.split('/').last
          reviewee.request_pull_request_review(name_and_repository, pull_request_number, reviewers: [@reviewer.name])
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end

      def create_feedback
        @review = Review.find(params[:id])
        if @review.update(feedback: params[:feedback])
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end

      def create_thanks
        @review = Review.find(params[:id])
        if @review.update(thanks: params[:thanks])
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
