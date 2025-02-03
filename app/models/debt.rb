class Debt < ApplicationRecord
  belongs_to :user

  validates :description, presence: true
  validates :total_amount, numericality: { greater_than_or_equal_to: 0 }
  validates :interest_rate, numericality: { greater_than_or_equal_to: 0 }
end
