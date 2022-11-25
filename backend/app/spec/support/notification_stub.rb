# frozen_string_literal: true

module NotificationStub
  def invalid_notification_save_stub
    allow_any_instance_of(Notification).to receive(:save).and_return(false)
  end

  def invalid_notification_update_stub
    allow_any_instance_of(Notification).to receive(:update).and_return(false)
  end
end
