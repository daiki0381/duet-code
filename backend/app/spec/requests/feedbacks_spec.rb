# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Feedbacks', type: :request do
  describe 'POST /api/v1/reviews/:review_id/feedback' do
    let(:review) { create(:review) }

    context 'when valid' do
      it '201' do
        post api_v1_review_feedback_path(review.id, params: { feedback: 'feedback' })
        expect(response).to have_http_status(:created)
      end
    end

    context 'when invalid' do
      before { invalid_review_update_stub }

      it '422' do
        post api_v1_review_feedback_path(review.id, params: { feedback: 'feedback' })
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
