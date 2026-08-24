class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy

  validates :name, :surname, :email, :address, :cap, :city, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, presence: true
  validates :total, numericality: { greater_than_or_equal_to: 0 }
end
