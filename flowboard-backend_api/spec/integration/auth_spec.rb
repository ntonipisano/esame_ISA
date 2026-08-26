require 'swagger_helper'

RSpec.describe 'Auth API', type: :request do
  path '/auth/register' do
    post 'Registra un nuovo utente' do
      tags 'Auth'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :user_params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string },
              password: { type: :string }
            },
            required: %w[email password]
          }
        },
        required: ['user']
      }

      response '201', 'utente registrato' do
        let(:user_params) { { user: { email: 'new_user@example.com', password: 'password123' } } }
        run_test!
      end

      response '422', 'email gia esistente o non valida' do
        let!(:existing_user) { User.create!(email: 'existing@example.com', password: 'password123') }
        let(:user_params) { { user: { email: 'existing@example.com', password: 'password123' } } }
        run_test!
      end
    end
  end

  path '/auth/login' do
    post 'Effettua il login' do
      tags 'Auth'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          password: { type: :string }
        },
        required: %w[email password]
      }

      let!(:user) { User.create!(email: 'user@example.com', password: 'password123') }

      response '200', 'login effettuato' do
        let(:credentials) { { email: 'user@example.com', password: 'password123' } }
        run_test!
      end

      response '401', 'credenziali non valide' do
        let(:credentials) { { email: 'user@example.com', password: 'wrongpassword' } }
        run_test!
      end
    end
  end

  path '/auth/me' do
    get 'Restituisce i dati dell utente corrente' do
      tags 'Auth'
      produces 'application/json'
      parameter name: 'Authorization', in: :header, type: :string, required: true

      let(:user) { User.create!(email: 'me@example.com', password: 'password123') }
      let(:auth_token) { Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first }

      response '200', 'utente trovato' do
        let(:Authorization) { "Bearer #{auth_token}" }
        run_test!
      end

      response '401', 'non autorizzato' do
        let(:Authorization) { "Bearer invalid_token" }
        run_test!
      end
    end
  end

  path '/auth/logout' do
    post 'Effettua il logout' do
      tags 'Auth'
      parameter name: 'Authorization', in: :header, type: :string, required: true

      let(:user) { User.create!(email: 'logout@example.com', password: 'password123') }
      let(:auth_token) { Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first }

      response '204', 'logout completato' do
        let(:Authorization) { "Bearer #{auth_token}" }
        run_test!
      end
    end
  end
end