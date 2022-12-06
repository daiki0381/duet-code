# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Users', type: :request do
  describe 'POST /api/v1/users' do
    let(:headers) do
      {
        Authorization: 'Bearer token'
      }
    end
    let(:user) { create(:user) }

    before { firebase_id_token_stub(user) }

    context 'when valid' do
      it '201' do
        post api_v1_users_path(headers,
                               params: { user: { github_access_token: user.github_access_token, name: user.name,
                                                 avatar: user.avatar } })
        expect(response).to have_http_status(:created)
      end
    end

    context 'when invalid' do
      before { invalid_user_save_stub }

      it '422' do
        post api_v1_users_path(headers,
                               params: { user: { github_access_token: user.github_access_token, name: user.name,
                                                 avatar: user.avatar } })
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'GET /api/v1/users/:id' do
    let(:user) { create(:user) }

    it '200' do
      get api_v1_user_path(user.id)
      assert_response_schema_confirm(200)
    end
  end
end
