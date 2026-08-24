Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'

  # AUTHENTICATION
  devise_for :users
  
  scope :auth, controller: :auth do
    post 'login'
    post 'register'
    post 'logout'
    get  'me'
  end

  # PRODUCTS
  resources :products, only: [:index, :show]

  # CART
  resource :cart, only: [:show], controller: 'cart' do
    get 'summary', to: 'cart#summary'
  end
  
  # CART ITEMS
  resources :cart_items, path: '/cart/items', only: [:create, :update, :destroy]

  # ORDERS
  resources :orders, only: [:create, :index, :show]

  # WISHLIST
  resources :wishlist_items, path: '/wishlist', only: [:index, :create, :destroy]

end