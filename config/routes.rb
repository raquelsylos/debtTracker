Rails.application.routes.draw do
  get 'home/index'
  devise_for :users

  # Define a root para usuários autenticados
  authenticated :user do
    root 'debts#index', as: :authenticated_root
  end

  # Define uma página inicial para usuários não autenticados
  unauthenticated do
    root 'home#index', as: :unauthenticated_root
  end

  # Rotas para dívidas
  resources :debts, only: [:index, :new, :create, :update, :destroy] do
    member do
      patch :toggle_paid # Adiciona a rota para alternar o status de pago
    end
  end
end
