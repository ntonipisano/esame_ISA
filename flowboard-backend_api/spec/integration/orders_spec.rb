require 'swagger_helper'

# Integration tests per l'endpoint creazione ordini
RSpec.describe 'Orders API', type: :request do
  path '/orders' do
    post 'Creates an order' do
      tags 'Orders'
      consumes 'application/json'
      produces 'application/json'

      # Autenticazione JWT
      parameter name: 'Authorization', in: :header, type: :string, required: true

      parameter name: :order, in: :body, schema: {
        type: :object,
        properties: {
          order: {
            type: :object,
            properties: {
              total: { type: :number },
              status: { type: :string },
              name: { type: :string },
              surname: { type: :string },
              email: { type: :string },
              address: { type: :string },
              city: { type: :string },
              cap: { type: :string }
            },
            required: %w[total status name surname email address city cap]
          }
        },
        required: ['order']
      }

      # Creazione utente e token JWT
      let(:user) { User.create!(email: 'test@example.com', password: 'password') }
      let(:auth_token) {  Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first }
      let(:Authorization) { "Bearer #{auth_token}" }
      let(:cart) { Cart.create!(user: user) }
      let(:product) { Product.create!(title: 'Prodotto', price: 10.0) }
      before do
        CartItem.create!(cart: cart, product: product, quantity: 1, unit_price: product.price)
      end

      # Caso successo
      response '201', 'order created' do
        let(:order) do
          {
            order: {
              total: 100.0,
              status: 'pending',
              name: 'Mario',
              surname: 'Rossi',
              email: 'mario@example.com',
              address: 'Via Roma 1',
              city: 'Roma',
              cap: '00100'
            }
          }
        end

        run_test!
      end

      # Caso errore di validazione
      response '422', 'invalid request' do
        let(:order) do
          {
            order: {
              total: nil,
              status: '',
              name: '',
              surname: '',
              email: 'invalid_email',
              address: '',
              city: '',
              cap: ''
            }
          }
        end

        run_test!
      end
    end
  end
end
