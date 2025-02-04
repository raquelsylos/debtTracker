class Debt < ApplicationRecord
  belongs_to :user

  validates :description, presence: true
  validates :total_amount, numericality: { greater_than_or_equal_to: 0 }, format: { with: /\A\d+(?:\.\d{1,2})?\z/ }
  validates :interest_rate, numericality: { greater_than_or_equal_to: 0 }, format: { with: /\A\d+(?:\.\d{1,2})?\z/ }
  validates :due_date, presence: true

   # Método para calcular o total atualizado com base nos dias de atraso
   def update_total_amount
    return if paid # Não atualiza se a dívida já foi paga

    # Calculando a diferença de dias entre hoje e a data de vencimento
    days_overdue = (Date.today - due_date).to_i

    # Se houver atraso (dias negativos ou zero não contam como atraso)
    if days_overdue > 0
      # Calculando os juros diários
      daily_interest = interest_rate / 365.0
      interest_amount = total_amount * daily_interest * days_overdue
      # Atualizando o total com o valor de juros
      self.total_updated = total_amount + interest_amount
    else
      # Se não houver atraso, o valor atualizado é o mesmo que o total inicial
      self.total_updated = total_amount
   end
  end

  # Chamando o método de atualização do valor total antes de salvar
  before_save :update_total_amount
end
