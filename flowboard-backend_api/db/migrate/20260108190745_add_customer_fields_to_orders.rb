class AddCustomerFieldsToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :name, :string
    add_column :orders, :surname, :string
    add_column :orders, :email, :string
    add_column :orders, :address, :string
    add_column :orders, :cap, :string
    add_column :orders, :city, :string
  end
end
