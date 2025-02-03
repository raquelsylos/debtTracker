Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  root "debts#index"
  # routes for debts controller
  resources :debts, only: [:index, :new, :create, :update, :destroy]
  
  # health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
