# frozen_string_literal: true

module FirebaseStub
  def firebase_stub(user)
    allow_any_instance_of(Firebase::Auth::Authenticable).to receive(:authenticate_entity).and_return(user)
  end

  def firebase_id_token_stub(user)
    allow(FirebaseIdToken::Certificates).to receive(:request).and_return(true)
    allow(FirebaseIdToken::Signature).to receive(:verify).and_return(
      'sub' => user.uid,
      'name' => user.name,
      'picture' => user.avatar
    )
  end
end
