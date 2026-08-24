require 'rails_helper'

# Model tests per Order
RSpec.describe Order, type: :model do
  let(:user) { User.create!(email: "test@example.com", password: "password") }

  it "is valid with valid attributes" do
    order = Order.new(
      user: user,
      total: 100.0,
      status: "pending",
      name: "Mario",
      surname: "Rossi",
      email: "mario@example.com",
      address: "Via Roma 1",
      city: "Roma",
      cap: "00100"
    )
    expect(order).to be_valid
  end

  it "is invalid without email" do
    order = Order.new(
      user: user,
      total: 100.0,
      status: "pending",
      name: "Mario",
      surname: "Rossi",
      email: nil,
      address: "Via Roma 1",
      city: "Roma",
      cap: "00100"
    )
    expect(order).not_to be_valid
  end

  it "is invalid with incorrect email format" do
    order = Order.new(
      user: user,
      total: 100.0,
      status: "pending",
      name: "Mario",
      surname: "Rossi",
      email: "invalid_email",
      address: "Via Roma 1",
      city: "Roma",
      cap: "00100"
    )
    expect(order).not_to be_valid
  end
end
