# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'RequestReviews', type: :request do
  describe 'POST /api/v1/reviews/:review_id/request_review' do
    let(:review) { create(:review) }

    before do
      github_add_reviewer_stub
    end

    it '201' do
      post api_v1_review_request_review_path(review.id)
      expect(response).to have_http_status(:created)
    end
  end
end
