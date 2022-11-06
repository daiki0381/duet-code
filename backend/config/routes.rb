# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'current_user/id', to: 'users#current_user_id'
      get 'current_user/pulls', to: 'users#current_user_pulls'
      get 'users/:id/wanted_reviews', to: 'users#user_wanted_reviews'
      get 'users/:id/accepted_reviews', to: 'users#user_accepted_reviews'
      post 'reviews/:id/accepted', to: 'reviews#accept_review'
      post 'reviews/:id/request_review', to: 'reviews#request_review'
      post 'reviews/:id/feedback', to: 'reviews#create_feedback'
      post 'reviews/:id/thanks', to: 'reviews#create_thanks'
      resources :users, only: %i[create show]
      resources :reviews, only: %i[index show create update destroy]
      get 'current_user/notifications', to: 'notifications#current_user_notifications'
      post 'reviews/:id/notifications/accepted', to: 'notifications#create_accepted_notification'
      post 'reviews/:id/notifications/feedback', to: 'notifications#create_feedback_notification'
      post 'reviews/:id/notifications/thanks', to: 'notifications#create_thanks_notification'
      patch 'notifications/:id', to: 'notifications#update'
    end
  end
end
