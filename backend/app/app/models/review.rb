# frozen_string_literal: true

class Review < ApplicationRecord
  belongs_to :reviewee, class_name: 'User', optional: true
  belongs_to :reviewer, class_name: 'User', optional: true
  has_many :review_languages, dependent: :destroy
  has_many :languages, through: :review_languages
  has_many :notifications, dependent: :destroy

  def add_reviewer(reviewee, reviewer)
    reviewee_client = Octokit::Client.new(access_token: reviewee.github_access_token)
    reviewer_client = Octokit::Client.new(access_token: reviewer.github_access_token)
    repository = pull_request_url.split('/')[4]
    name_and_repository = "#{reviewee.name}/#{repository}"
    reviewee_client.add_collaborator(name_and_repository, reviewer.name)
    repository_invitations = reviewee_client.repository_invitations(name_and_repository)
    reviewer_client.accept_repository_invitation(repository_invitations[0].id) unless repository_invitations.empty?
    pull_request_number = pull_request_url.split('/').last
    reviewee_client.request_pull_request_review(name_and_repository, pull_request_number, reviewers: [reviewer.name])
  end
end
