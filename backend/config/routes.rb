# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'current_user/id', to: 'users#current_user_id'
      get 'current_user/repos', to: 'users#current_user_repos'
      get 'current_user/pulls', to: 'users#current_user_pulls'
      get 'users/:id/wanted_reviews', to: 'users#user_wanted_reviews'
      get 'users/:id/accepted_reviews', to: 'users#user_accepted_reviews'
      post 'reviews/:id/accepted', to: 'reviews#accept_review'
      post 'reviews/:id/feedback', to: 'reviews#create_feedback'
      post 'reviews/:id/thanks', to: 'reviews#create_thanks'
      resources :users, only: %i[create show]
      resources :reviews, only: %i[index show create update destroy]
    end
  end
end
