require 'rails_helper'

RSpec.describe OrderItem, type: :model do
  let(:user) { User.create!(email: "order_user@example.com", password: "password123") }
  let(:order) do
    Order.create!(
      user: user, total: 50.0, status: "paid",
      name: "Mario", surname: "Rossi", email: "mario@example.com",
      address: "Via Roma 1", city: "Roma", cap: "00100"
    )
  end
  let(:product) { Product.create!(title: "Scarpe", price: 2.50) }

  it "is valid with valid attributes" do
    order_item = OrderItem.new(order: order, product: product, quantity: 2, unit_price: 2.50)
    expect(order_item).to be_valid
  end

  it "is invalid with zero or negative quantity" do
    order_item = OrderItem.new(order: order, product: product, quantity: 0, unit_price: 2.50)
    expect(order_item).not_to be_valid
  end

  it "is invalid with negative unit_price" do
    order_item = OrderItem.new(order: order, product: product, quantity: 1, unit_price: -1.0)
    expect(order_item).not_to be_valid
  end
end