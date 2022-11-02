# frozen_string_literal: true

require 'octokit'

module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user, only: %i[current_user_id current_user_repos current_user_pulls]

      def create
        FirebaseIdToken::Certificates.request
        raise ArgumentError, 'BadRequest Parameter' if payload.blank?

        @user = User.find_or_initialize_by(uid: payload['sub']) do |user|
          user.assign_attributes(sign_up_params)
        end
        if @user.save
          render status: :created
        else
          render status: :unprocessable_entity
        end
      end

      def show
        @user = User.find(params[:id]).attributes
        @user.delete('github_access_token')
        @user.delete('uid')
        render json: @user, status: :ok
      end

      def current_user_id
        render json: current_user.id, status: :ok
      end

      def current_user_repos
        user_id = current_user.id
        @user = User.find(user_id)
        name = @user.name
        github_access_token = @user.github_access_token
        client = Octokit::Client.new(access_token: github_access_token)
        repos = client.repos(name).map(&:name)
        render json: repos, status: :ok
      end

      def current_user_pulls
        user_id = current_user.id
        @user = User.find(user_id)
        name = @user.name
        repo = params[:repo]
        github_access_token = @user.github_access_token
        client = Octokit::Client.new(access_token: github_access_token)
        pulls = client.pulls("#{name}/#{repo}").map { |pull| { title: pull.title, url: pull.html_url } }
        render json: pulls, status: :ok
      end

      def user_wanted_reviews
        @user = User.find(params[:id])
        @wanted_reviews = Review.where(reviewee_id: @user.id).map do |review|
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
        render json: @wanted_reviews, status: :ok
      end

      def user_accepted_reviews
        @user = User.find(params[:id])
        @accepted_reviews = Review.where(reviewer_id: @user.id).map do |review|
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
        render json: @accepted_reviews, status: :ok
      end

      private

      def sign_up_params
        params.require(:user).permit(:github_access_token, :name, :avatar)
      end

      def token_from_request_headers
        request.headers['Authorization']&.split&.last
      end

      def token
        params[:token] || token_from_request_headers
      end

      def payload
        @payload ||= FirebaseIdToken::Signature.verify token
      end
    end
  end
end
