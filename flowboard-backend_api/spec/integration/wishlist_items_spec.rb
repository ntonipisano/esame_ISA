require 'swagger_helper'

RSpec.describe 'Wishlist API', type: :request do
  let(:user) { User.create!(email: 'wishlist@example.com', password: 'password123') }
  let(:auth_token) { Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first }
  let(:Authorization) { "Bearer #{auth_token}" }
  let!(:product) { Product.create!(title: 'Monitor', price: 150.0) }

  path '/wishlist' do
    get 'Recupera tutti i prodotti nei preferiti' do
      tags 'Wishlist'
      produces 'application/json'
      parameter name: 'Authorization', in: :header, type: :string, required: true

      response '200', 'wishlist recuperata' do
        run_test!
      end
    end

    post 'Aggiunge un prodotto ai preferiti' do
      tags 'Wishlist'
      consumes 'application/json'
      produces 'application/json'
      parameter name: 'Authorization', in: :header, type: :string, required: true

      parameter name: :params_body, in: :body, schema: {
        type: :object,
        properties: {
          product_id: { type: :integer }
        },
        required: ['product_id']
      }

      response '201', 'prodotto aggiunto ai preferiti' do
        let(:params_body) { { product_id: product.id } }
        run_test!
      end

      response '422', 'prodotto gia presente' do
        before { user.wishlist_items.create!(product: product) }
        let(:params_body) { { product_id: product.id } }
        run_test!
      end
    end
  end

  path '/wishlist/{id}' do
    delete 'Rimuove un prodotto dai preferiti usando product_id' do
      tags 'Wishlist'
      produces 'application/json'
      parameter name: 'Authorization', in: :header, type: :string, required: true
      parameter name: :id, in: :path, type: :integer, required: true

      response '200', 'prodotto rimosso con successo' do
        before { user.wishlist_items.create!(product: product) }
        let(:id) { product.id }
        run_test!
      end

      response '404', 'prodotto non presente nella wishlist' do
        let(:id) { 0 }
        run_test!
      end
    end
  end
end