# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :current_user do
        resource :id, only: %i[show]
        resources :pulls, only: %i[index]
        resources :notifications, only: %i[index]
      end

      resources :users, only: %i[create show] do
        resources :wanted_reviews, only: %i[index]
        resources :accepted_reviews, only: %i[index]
      end

      resources :reviews, only: %i[index show create update destroy] do
        resource :accepted, only: %i[create]
        resource :request_review, only: %i[create]
        resource :feedback, only: %i[create]
        resource :thanks, only: %i[create]
        namespace :notifications do
          resource :accepted, only: %i[create]
          resource :feedback, only: %i[create]
          resource :thanks, only: %i[create]
        end
      end
      
      resources :notifications, only: %i[update]
    end
  end
end
