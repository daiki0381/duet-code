# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Notifications', type: :request do
  describe 'PATCH /api/v1/notifications/:id' do
    let(:notification) { create(:notification) }

    context 'when valid' do
      it '200' do
        patch api_v1_notification_path(notification.id)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when invalid' do
      before { invalid_notification_update_stub }

      it '422' do
        patch api_v1_notification_path(notification.id)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
