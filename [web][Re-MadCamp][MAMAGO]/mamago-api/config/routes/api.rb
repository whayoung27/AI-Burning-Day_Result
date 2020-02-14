# frozen_string_literal: true

namespace :api, defaults: { format: :json } do
  resources :users do
    collection do
      post :login
    end
  end
  resources :dialogs
  resources :questions
end
