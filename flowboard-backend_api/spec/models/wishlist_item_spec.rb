require 'rails_helper'

RSpec.describe WishlistItem, type: :model do
  let(:user) { User.create!(email: "wish_user@example.com", password: "password123") }
  let(:product) { Product.create!(title: "Racchetta", price: 100.0) }

  it "is valid with user and product" do
    wishlist_item = WishlistItem.new(user: user, product: product)
    expect(wishlist_item).to be_valid
  end

  it "is invalid when duplicate product is added for the same user" do
    WishlistItem.create!(user: user, product: product)
    duplicate_item = WishlistItem.new(user: user, product: product)
    expect(duplicate_item).not_to be_valid
  end
end