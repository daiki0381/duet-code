# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'current_user/id', to: 'users#current_user_id'
      resources :users, only: %i[create show]
      resources :posts, only: %i[index show create update destroy]
    end
  end
end
