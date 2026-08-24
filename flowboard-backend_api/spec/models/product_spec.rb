require 'rails_helper'

# Model tests per Product
RSpec.describe Product, type: :model do
  it "is valid with valid attributes" do
    product = Product.new(
      title: "Prodotto di test",
      price: 10.0
    )

    expect(product).to be_valid
  end

  it "is invalid without title" do
    product = Product.new(
      title: nil,
      price: 10.0
    )

    expect(product).not_to be_valid
  end

  it "is invalid without price" do
    product = Product.new(
      title: "Prodotto di test",
      price: nil
    )

    expect(product).not_to be_valid
  end

  it "is invalid with non-numeric price" do
    product = Product.new(
      title: "Prodotto di test",
      price: "abc"
    )

    expect(product).not_to be_valid
  end

  it "is invalid with negative price" do
    product = Product.new(
      title: "Prodotto di test",
      price: -5
    )

    expect(product).not_to be_valid
  end
end
