require 'swagger_helper'

RSpec.describe 'Cart API', type: :request do
  path '/cart' do
    get 'Recupera il carrello dell utente' do
      tags 'Cart'
      produces 'application/json'
      parameter name: 'Authorization', in: :header, type: :string, required: true

      let(:user) { User.create!(email: 'cart@example.com', password: 'password123') }
      let(:auth_token) { Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first }
      let(:Authorization) { "Bearer #{auth_token}" }

      response '200', 'carrello recuperato' do
        run_test!
      end
    end
  end

  path '/cart/summary' do
    get 'Recupera il riepilogo e il totale del carrello' do
      tags 'Cart'
      produces 'application/json'
      parameter name: 'Authorization', in: :header, type: :string, required: true

      let(:user) { User.create!(email: 'summary@example.com', password: 'password123') }
      let(:auth_token) { Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first }
      let(:Authorization) { "Bearer #{auth_token}" }

      before do
        cart = user.create_cart
        product = Product.create!(title: 'Tastiera', price: 50.0)
        cart.cart_items.create!(product: product, quantity: 2, unit_price: 50.0)
      end

      response '200', 'riepilogo calcolato' do
        run_test!
      end
    end
  end
end