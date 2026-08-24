class CartItemsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_cart

  # POST /cart/items
  # Aggiunge un prodotto al carrello o aumenta la quantità se esiste
  def create
    product = Product.find(params[:product_id])
    item = @cart.cart_items.find_or_initialize_by(product: product)
    item.quantity = (item.quantity || 0) + params[:quantity].to_i
    item.unit_price = product.price
    item.save!
    render json: @cart, include: :cart_items
  end

  # PATCH /cart/items/:id
  # Aggiorna la quantità di un articolo nel carrello
  def update
    item = @cart.cart_items.find(params[:id])
    item.update!(quantity: params[:quantity])
    render json: @cart, include: :cart_items
  end

  # DELETE /cart/items/:id
  # Rimuove un articolo dal carrello
  def destroy
    item = @cart.cart_items.find(params[:id])
    item.destroy
    render json: @cart, include: :cart_items
  end

  private
  # Recupera il carrello dell'utente autenticato, creandolo se non esiste
  def set_cart
    @cart = current_user.cart || current_user.create_cart
  end
end
