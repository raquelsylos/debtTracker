class DebtsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_debt, only: [:update, :destroy, :toggle_paid]

  def index
    @debts = current_user.debts
    @debt = Debt.new
  end

  def create
    @debt = current_user.debts.build(debt_params)

    respond_to do |format|
      if @debt.save
        format.html { redirect_to debts_path, notice: "Item adicionado com sucesso!" }
        format.json { render json: @debt.as_json(only: [:id, :description, :due_date, :total_amount, :interest_rate], methods: [:total_updated]), status: :created }
      else
        format.html { render :index, status: :unprocessable_entity }
        format.json { render json: @debt.errors, status: :unprocessable_entity }
      end
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
        format.html { redirect_to debts_path, notice: 'Item excluído com sucesso' }
        format.json { head :no_content }
      else
        format.html { redirect_to debts_path, alert: 'Erro ao excluir item.' }
        format.json { render json: @debt.errors, status: :unprocessable_entity }
      end
    end
  end

  def toggle_paid
    if @debt.update(paid: params[:debt][:paid])
      render json: { success: true }, status: :ok
    else
      render json: { success: false, errors: @debt.errors.full_messages }, status: :unprocessable_entity
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
