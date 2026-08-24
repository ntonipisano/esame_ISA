class CartController < ApplicationController
  before_action :authenticate_user!

  # GET /cart
  # Recupera il carrello dell'utente autenticato, creandolo se non esiste
  def show
    cart = current_user.cart || current_user.create_cart
    render json: cart, include: { cart_items: { include: :product } }
  end

  # GET /cart/summary
  def summary
  cart = current_user.cart
  total = cart.cart_items.sum { |i| i.quantity * i.unit_price }

  render json: {
    total: total,
    items: cart.cart_items.includes(:product)
    }
  end

end
