# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Reviews', type: :request do
  describe 'GET /api/v1/reviews' do
    it '200' do
      get api_v1_reviews_path
      assert_response_schema_confirm(200)
    end
  end

  describe 'GET /api/v1/reviews/:id' do
    let(:review) { create(:review) }

    it '200' do
      get api_v1_review_path(review.id)
      assert_response_schema_confirm(200)
    end
  end

  describe 'POST /api/v1/reviews' do
    let(:headers) do
      {
        Authorization: 'Bearer token'
      }
    end
    let(:user) { create(:user) }

    before { firebase_stub(user) }

    context 'when valid' do
      it '201' do
        post api_v1_reviews_path(headers,
                                 params: { title: 'title', review_point: 'review_point', pull_request_url: 'pull_request_url', languages: ['language'],
                                           pull_request_description: 'pull_request_description' })
        expect(response).to have_http_status(:created)
      end
    end

    context 'when invalid' do
      before { invalid_review_save_stub }

      it '422' do
        post api_v1_reviews_path(headers,
                                 params: { title: 'title', review_point: 'review_point', pull_request_url: 'pull_request_url', languages: ['language'],
                                           pull_request_description: 'pull_request_description' })
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PATCH /api/v1/reviews/:id' do
    let(:review) { create(:review) }

    context 'when valid' do
      it '201' do
        patch api_v1_review_path(review.id,
                                 params: { title: 'title', review_point: 'review_point', pull_request_url: 'pull_request_url', languages: ['language'],
                                           pull_request_description: 'pull_request_description' })
        expect(response).to have_http_status(:created)
      end
    end

    context 'when invalid' do
      before { invalid_review_update_stub }

      it '422' do
        patch api_v1_review_path(review.id,
                                 params: { title: 'title', review_point: 'review_point', pull_request_url: 'pull_request_url', languages: ['language'],
                                           pull_request_description: 'pull_request_description' })
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE /api/v1/reviews/:id' do
    let(:review) { create(:review) }

    it '204' do
      delete api_v1_review_path(review.id)
      expect(response).to have_http_status(:no_content)
    end
  end
end
