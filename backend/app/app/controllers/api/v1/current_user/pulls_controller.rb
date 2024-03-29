# frozen_string_literal: true

module Api
  module V1
    module CurrentUser
      class PullsController < ApplicationController
        before_action :authenticate_user

        def index
          user_id = current_user.id
          @user = User.find(user_id)
          name = @user.name
          github_access_token = @user.github_access_token
          pulls = fetch_pulls(name, github_access_token)
          render json: pulls, status: :ok
        end

        private

        def fetch_pulls(name, github_access_token)
          client = Octokit::Client.new(access_token: github_access_token)
          repos = client.repos(name).map(&:name)
          Parallel.map(repos, in_threads: 10) do |repo|
            client.pulls("#{name}/#{repo}").filter_map do |pull|
              { title: "#{pull.head.repo.name}/#{pull.title}", url: pull.html_url } if pull.user.login == name
            end
          end.flatten
        end
      end
    end
  end
end
