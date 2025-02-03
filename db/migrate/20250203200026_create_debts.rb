class CreateDebts < ActiveRecord::Migration[7.1]
  def change
    create_table :debts do |t|
      t.string :description
      t.date :due_date
      t.decimal :total_amount
      t.decimal :interest_rate
      t.decimal :total_updated
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
