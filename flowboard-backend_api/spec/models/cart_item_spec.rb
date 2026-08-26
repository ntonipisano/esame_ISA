require 'rails_helper'

RSpec.describe CartItem, type: :model do
  let(:user) { User.create!(email: "item_user@example.com", password: "password123") }
  let(:cart) { Cart.create!(user: user) }
  let(:product) { Product.create!(title: "T-Shirt", price: 20.0) }

  it "is valid with valid attributes" do
    cart_item = CartItem.new(cart: cart, product: product, quantity: 2, unit_price: 20.0)
    expect(cart_item).to be_valid
  end

  it "is invalid with quantity less than or equal to 0" do
    cart_item = CartItem.new(cart: cart, product: product, quantity: 0, unit_price: 20.0)
    expect(cart_item).not_to be_valid
  end

  it "is invalid with negative unit_price" do
    cart_item = CartItem.new(cart: cart, product: product, quantity: 1, unit_price: -5.0)
    expect(cart_item).not_to be_valid
  end
end