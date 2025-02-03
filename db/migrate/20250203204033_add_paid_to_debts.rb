class AddPaidToDebts < ActiveRecord::Migration[7.1]
  def change
    add_column :debts, :paid, :boolean, default: false
  end
end
