# frozen_string_literal: true

require 'octokit'

module Api
  module V1
    class RequestReviewsController < ApplicationController
      def create
        @review = Review.find(params[:review_id])
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
        render json: { status_code: 201, status: 'created' }, status: :created
      end
    end
  end
end
