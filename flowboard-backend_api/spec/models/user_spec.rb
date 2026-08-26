require 'rails_helper'

RSpec.describe User, type: :model do
  let(:valid_attributes) do
    { email: "user@example.com", password: "password123" }
  end

  it "is valid with valid attributes" do
    user = User.new(valid_attributes)
    expect(user).to be_valid
  end

  it "is invalid without email" do
    user = User.new(valid_attributes.merge(email: nil))
    expect(user).not_to be_valid
  end

  it "is invalid with duplicate email" do
    User.create!(valid_attributes)
    duplicate_user = User.new(valid_attributes)
    expect(duplicate_user).not_to be_valid
  end

  it "is invalid with incorrect email format" do
    user = User.new(valid_attributes.merge(email: "bad_email_format"))
    expect(user).not_to be_valid
  end

  it "is invalid with short password" do
    user = User.new(valid_attributes.merge(password: "12345"))
    expect(user).not_to be_valid
  end
end