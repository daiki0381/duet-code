# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'AcceptedReviews', type: :request do
  describe 'GET /api/v1/users/:user_id/accepted_reviews' do
    let(:user) { create(:user) }

    it '200' do
      get api_v1_user_accepted_reviews_path(user.id)
      assert_response_schema_confirm(200)
    end
  end
end
