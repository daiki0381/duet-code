# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Reviews', type: :request do
  describe 'POST /api/v1/reviews/:review_id/accepted' do
    let(:headers) do
      {
        Authorization: 'Bearer token'
      }
    end
    let(:review) { create(:review) }
    let(:user) { create(:user) }

    before { firebase_stub(user) }

    context 'when valid' do
      it '201' do
        post api_v1_review_accepted_path(review.id, headers)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when invalid' do
      before { invalid_review_update_stub }

      it '422' do
        post api_v1_review_accepted_path(review.id, headers)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
