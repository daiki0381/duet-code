class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :uid, comment: 'Firebase AuthenticationのGitHub認証のユーザー識別子'
      t.string :github_access_token, comment: 'GitHubのアクセストークン'
      t.string :name, comment: 'ユーザー名'
      t.string :avatar, comment: 'アバター画像'

      t.timestamps
    end
  end
end
