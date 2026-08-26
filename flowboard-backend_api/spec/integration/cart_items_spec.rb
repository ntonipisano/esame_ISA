require 'swagger_helper'

RSpec.describe 'Cart Items API', type: :request do
  let(:user) { User.create!(email: 'items@example.com', password: 'password123') }
  let(:auth_token) { Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first }
  let(:Authorization) { "Bearer #{auth_token}" }
  let!(:product) { Product.create!(title: 'Cuffie', price: 40.0) }

  path '/cart/items' do
    post 'Aggiunge un elemento al carrello' do
      tags 'Cart Items'
      consumes 'application/json'
      produces 'application/json'
      parameter name: 'Authorization', in: :header, type: :string, required: true

      parameter name: :item_params, in: :body, schema: {
        type: :object,
        properties: {
          product_id: { type: :integer },
          quantity: { type: :integer }
        },
        required: %w[product_id quantity]
      }

      response '200', 'articolo aggiunto' do
        let(:item_params) { { product_id: product.id, quantity: 2 } }
        run_test!
      end
    end
  end

  path '/cart/items/{id}' do
    patch 'Aggiorna la quantita di un elemento' do
      tags 'Cart Items'
      consumes 'application/json'
      produces 'application/json'
      parameter name: 'Authorization', in: :header, type: :string, required: true
      parameter name: :id, in: :path, type: :integer, required: true

      parameter name: :update_params, in: :body, schema: {
        type: :object,
        properties: {
          quantity: { type: :integer }
        },
        required: ['quantity']
      }

      let!(:cart) { user.create_cart }
      let!(:cart_item) { cart.cart_items.create!(product: product, quantity: 1, unit_price: 40.0) }

      response '200', 'quantita aggiornata' do
        let(:id) { cart_item.id }
        let(:update_params) { { quantity: 5 } }
        run_test!
      end
    end

    delete 'Rimuove un elemento dal carrello' do
      tags 'Cart Items'
      produces 'application/json'
      parameter name: 'Authorization', in: :header, type: :string, required: true
      parameter name: :id, in: :path, type: :integer, required: true

      let!(:cart) { user.create_cart }
      let!(:cart_item) { cart.cart_items.create!(product: product, quantity: 1, unit_price: 40.0) }

      response '200', 'articolo rimosso' do
        let(:id) { cart_item.id }
        run_test!
      end
    end
  end
end