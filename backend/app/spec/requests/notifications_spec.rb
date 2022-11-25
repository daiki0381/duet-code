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

  describe 'POST /api/v1/reviews/:id/notifications/accepted' do
    let(:review) { create(:review) }

    context 'when valid' do
      it '201' do
        post api_v1_create_accepted_notification_path(review.id)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when invalid' do
      before { invalid_notification_save_stub }

      it '422' do
        post api_v1_create_accepted_notification_path(review.id)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST /api/v1/reviews/:id/notifications/feedback' do
    let(:review) { create(:review) }

    context 'when valid' do
      it '201' do
        post api_v1_create_feedback_notification_path(review.id)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when invalid' do
      before { invalid_notification_save_stub }

      it '422' do
        post api_v1_create_feedback_notification_path(review.id)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST /api/v1/reviews/:id/notifications/thanks' do
    let(:review) { create(:review) }

    context 'when valid' do
      it '201' do
        post api_v1_create_thanks_notification_path(review.id)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when invalid' do
      before { invalid_notification_save_stub }

      it '422' do
        post api_v1_create_thanks_notification_path(review.id)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PATCH /api/v1/notifications/:id' do
    let(:notification) { create(:notification) }

    context 'when valid' do
      it '200' do
        patch api_v1_update_notification_path(notification.id)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when invalid' do
      before { invalid_notification_update_stub }

      it '422' do
        patch api_v1_update_notification_path(notification.id)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
