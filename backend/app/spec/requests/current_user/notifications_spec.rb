# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Notifications', type: :request do
  describe 'GET /api/v1/current_user/notifications' do
    let(:headers) do
      {
        Authorization: 'Bearer token'
      }
    end
    let(:user) { create(:user) }

    before { firebase_stub(user) }

    it '200' do
      get api_v1_current_user_notifications_path(headers)
      assert_response_schema_confirm(200)
    end
  end
end
