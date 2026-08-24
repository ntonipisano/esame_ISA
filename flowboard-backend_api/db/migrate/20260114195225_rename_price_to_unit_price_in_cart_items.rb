class RenamePriceToUnitPriceInCartItems < ActiveRecord::Migration[8.1]
  def change
    rename_column :cart_items, :price, :unit_price
  end
end

