class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :uid, null: false, comment: 'Firebase AuthenticationのGitHub認証のユーザー識別子'
      t.string :github_access_token, null: false, comment: 'GitHubのアクセストークン'
      t.string :name, null: false, comment: 'ユーザー名'
      t.string :avatar, null: false, comment: 'アバター画像'

      t.timestamps
    end
  end
end
