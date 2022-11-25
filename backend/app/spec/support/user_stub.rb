# frozen_string_literal: true

module UserStub
  def invalid_user_save_stub
    allow_any_instance_of(User).to receive(:save).and_return(false)
  end
end
