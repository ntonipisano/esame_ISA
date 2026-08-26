require 'rails_helper'

RSpec.describe Cart, type: :model do
  let(:user) { User.create!(email: "cart_user@example.com", password: "password123") }

  it "is valid when associated with a user" do
    cart = Cart.new(user: user)
    expect(cart).to be_valid
  end

  it "destroys associated cart items when destroyed" do
    cart = Cart.create!(user: user)
    product = Product.create!(title: "Palline", price: 999.99)
    cart.cart_items.create!(product: product, quantity: 1, unit_price: 999.99)

    expect { cart.destroy }.to change(CartItem, :count).by(-1)
  end
end