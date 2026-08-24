class ProductsController < ApplicationController

  # GET /products
  # Recupera la lista di tutti i prodotti
  def index
    products = Product.all
    render json: products
  end

  # GET /products/:id
  # Recupera i dettagli di un prodotto specifico per ID
  def show
    product = Product.find(params[:id])
    render json: product
  end
  
end

