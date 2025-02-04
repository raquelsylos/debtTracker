class DebtsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_debt, only: [:update, :destroy]

  def index
    @debts = current_user.debts
    @debt = Debt.new
  end

  def create
    @debt = current_user.debts.build(debt_params)

    if @debt.save
      redirect_to debts_path, notice: "Item adicionado com sucesso!"
    else
      render :index, status: :unprocessable_entity
    end
  end

  def update
    respond_to do |format|
      if @debt.update(paid: params[:paid])
        format.html { redirect_to debts_path, notice: 'Status atualizado!' }
        format.json { head :no_content }
      else
        format.html { redirect_to debts_path, alert: 'Erro ao atualizar status.' }
        format.json { render json: @debt.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @debt.destroy
        format.html { redirect_to debts_path, notice: 'Item excluído com sucesso!' }
        format.json { head :no_content }
      else
        format.html { redirect_to debts_path, alert: 'Erro ao excluir item.' }
        format.json { render json: @debt.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_debt
    @debt = current_user.debts.find(params[:id])
  end

  def debt_params
    params.require(:debt).permit(:description, :due_date, :total_amount, :interest_rate, :total_updated)
  end
 end
