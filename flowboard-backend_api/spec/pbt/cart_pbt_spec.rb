require 'swagger_helper'
require 'prop_check'

RSpec.describe 'Cart Property-Based Tests', type: :request do
  include PropCheck::Generators

  let!(:user) do
    User.create!(
      email: 'property_test@example.com',
      password: 'password123'
    )
  end

  let!(:cart) do
    user.create_cart
  end

  let!(:product) do
    Product.create!(
      title: 'Property Test Product',
      price: 100
    )
  end

  let(:auth_token) do
    Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
  end

  let(:headers) do
    {
      'Authorization' => "Bearer #{auth_token}"
    }
  end

  it 'Per qualsiasi carrello composto da articoli validi il totale deve essere uguale alla somma di quantity × unit_price di tutti gli articoli.' do

    items_generator =
      array(
        tuple(
          choose(1..20),
          choose(0..10_000)
        ),
        min: 0,
        max: 20
      )

    PropCheck.forall(items_generator) do |generated_items|

      cart.cart_items.destroy_all

      generated_items.each do |quantity, unit_price|
        cart.cart_items.create!(
          product: product,
          quantity: quantity,
          unit_price: unit_price
        )
      end

      get '/cart/summary', headers: headers

      body = JSON.parse(response.body)

      expected_total =
        generated_items.sum do |quantity, unit_price|
          quantity * unit_price
        end

      expect(response).to have_http_status(:ok)

      expect(body['total'].to_f).to eq(expected_total.to_f)   #Il totale calcolato dal backend deve essere uguale al totale calcolato dal test.
    end
  end
end