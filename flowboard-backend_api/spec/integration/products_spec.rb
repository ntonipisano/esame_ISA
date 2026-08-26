require 'swagger_helper'

RSpec.describe 'Products API', type: :request do
  path '/products' do
    get 'Recupera tutti i prodotti' do
      tags 'Products'
      produces 'application/json'

      response '200', 'prodotti trovati' do
        before { Product.create!(title: 'Laptop', price: 999.99) }
        run_test!
      end
    end
  end

  path '/products/{id}' do
    get 'Recupera il dettaglio di un prodotto' do
      tags 'Products'
      produces 'application/json'
      parameter name: :id, in: :path, type: :integer, required: true

      let!(:product) { Product.create!(title: 'Mouse', price: 25.0) }

      response '200', 'prodotto trovato' do
        let(:id) { product.id }
        run_test!
      end

      response '404', 'prodotto non trovato' do
        let(:id) { 0 }
        run_test!
      end
    end
  end
end