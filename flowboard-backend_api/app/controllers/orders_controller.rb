class OrdersController < ApplicationController
  before_action :authenticate_user!

  # POST /orders
  # Crea un nuovo ordine a partire dal carrello e lo svuota dopo il successo
  def create
    cart = current_user.cart
    return render json: { error: "Carrello vuoto" }, status: :unprocessable_entity if cart.cart_items.empty? #Errore 422

    order_params = params.require(:order).permit(:name, :surname, :email, :address, :cap, :city)

    order = current_user.orders.create!(status: "pending", total: 0, **order_params)

    cart.cart_items.each do |item|
      order.order_items.create!(
        product: item.product,
        quantity: item.quantity,
        unit_price: item.unit_price
      )
    end

    order.update!(total: order.order_items.sum { |i| i.quantity * i.unit_price })

    cart.cart_items.destroy_all

    render json: order, include: { order_items: { include: :product } }, status: :created
  end

  # GET /orders/:id
  # Recupera i dettagli di un ordine specifico
  def show
    order = current_user.orders.find(params[:id])
    render json: order, include: { order_items: { include: :product } }
  end

  # GET /orders
  # Recupera la lista di tutti gli ordini dell'utente autenticato
  def index
    orders = current_user.orders.includes(order_items: :product)
    render json: orders, include: { order_items: { include: :product } }
  end
end
