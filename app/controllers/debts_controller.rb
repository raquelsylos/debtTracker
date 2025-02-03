class DebtsController < ApplicationController
  before_action :set_debt, only: [:update]

  def index
    @debts = Debt.all
    @debt = Debt.new
  end

  def create
    @debt = Debt.new(debt_params)
    @debt.user_id = 1 # ajusta p/ usuário correto

    if @debt.save
      redirect_to root_path, notice: "item adicionado com sucesso!"
    else
      render :index, status: :unprocessable_entity
    end
  end

  def update
    if @debt.update(paid: params[:paid])
      redirect_to debts_path, notice: "status atualizado!"
    else
      render :index, status: :unprocessable_entity
    end
  end

  private

  def set_debt
    @debt = Debt.find(params[:id])
  end

  def debt_params
    params.require(:debt).permit(:description, :due_date, :total_amount, :interest_rate, :total_updated)
  end
end
