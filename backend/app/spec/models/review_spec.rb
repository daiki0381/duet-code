# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Review, type: :model do
  describe 'add_reviewer' do
    let(:review) { create(:review) }

    it 'OK' do
      allow(review).to receive(:add_reviewer).and_return(github_add_reviewer_stub)
      expect { review.add_reviewer(review.reviewee, review.reviewer) }.not_to raise_error
    end
  end
end
