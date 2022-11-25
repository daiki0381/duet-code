# frozen_string_literal: true

module ReviewStub
  def invalid_review_save_stub
    allow_any_instance_of(Review).to receive(:save).and_return(false)
  end

  def invalid_review_update_stub
    allow_any_instance_of(Review).to receive(:update).and_return(false)
  end
end
