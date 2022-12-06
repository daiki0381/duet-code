# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Pulls', type: :request do
  describe 'GET /api/v1/current_user/pulls' do
    let(:headers) do
      {
        Authorization: 'Bearer token'
      }
    end
    let(:user) { create(:user) }

    before do
      firebase_stub(user)
      github_repos_stub
      github_pulls_stub
    end

    it '200' do
      get api_v1_current_user_pulls_path(headers)
      assert_response_schema_confirm(200)
    end
  end
end
