import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["deleteButton"];

  connect() {
    console.log("Debt controller connected");
  }

  addDebt(event) {
    const [data, status, xhr] = event.detail;

    // Adicionar a nova dívida à tabela de "Despesas Pendentes"
    const unpaidTableBody = document.querySelector("#unpaid-debts tbody");
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-debt-id", data.id);

    newRow.innerHTML = `
      <td data-label="Descrição">${data.description}</td>
      <td data-label="Vencimento">${data.due_date || "N/A"}</td>
      <td data-label="Total">R$ ${data.total_amount.toFixed(2)}</td>
      <td data-label="Encargos">${data.interest_rate.toFixed(2)}%</td>
      <td data-label="Total Atualizado">R$ ${data.total_updated.toFixed(2)}</td>
      <td data-label="Pago">
        <div class="form-check">
          <input type="checkbox"
                 class="form-check-input"
                 data-controller="debt"
                 data-action="change->debt#togglePaid"
                 data-debt-id="${data.id}">
        </div>
      </td>
      <td data-label="Ações">
        <button class="btn btn-danger btn-sm" data-debt-id="${data.id}" data-action="debt#delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;

    unpaidTableBody.appendChild(newRow);

    // Atualizar os totais
    this.updateTotals();

    // Limpar o formulário
    event.target.reset();
  }

  handleError(event) {
    const [data, status, xhr] = event.detail;
    alert("Erro ao adicionar a dívida. Verifique os campos e tente novamente.");
  }

  togglePaid(event) {
    const checkbox = event.target;
    const debtId = checkbox.dataset.debtId;
    const checked = checkbox.checked;

    // Enviar requisição PATCH para atualizar o status de "pago"
    fetch(`/debts/${debtId}/toggle_paid`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
      },
      body: JSON.stringify({ debt: { paid: checked } }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao atualizar o status da dívida.");
        }
        return response.json();
      })
      .then(() => {
        // Mover a linha para a tabela correta
        const row = checkbox.closest("tr");
        const targetTable = checked
          ? document.querySelector("#paid-debts tbody")
          : document.querySelector("#unpaid-debts tbody");

        targetTable.appendChild(row);

        // Atualizar os totais
        this.updateTotals();
      })
      .catch((error) => {
        console.error(error);
        checkbox.checked = !checked; // Reverter o estado do checkbox em caso de erro
        alert("Erro ao atualizar o status. Tente novamente.");
      });
  }

  updateTotals() {
    const unpaidRows = document.querySelectorAll("#unpaid-debts tbody tr");
    const paidRows = document.querySelectorAll("#paid-debts tbody tr");

    let unpaidTotal = 0;
    let paidTotal = 0;

    unpaidRows.forEach((row) => {
      const updatedCell = row.querySelector('[data-label="Total Atualizado"]');
      if (updatedCell) {
        const updated = parseFloat(
          updatedCell.textContent.replace("R$ ", "").replace(",", ".")
        );
        unpaidTotal += isNaN(updated) ? 0 : updated;
      }
    });

    paidRows.forEach((row) => {
      const updatedCell = row.querySelector('[data-label="Total Atualizado"]');
      if (updatedCell) {
        const updated = parseFloat(
          updatedCell.textContent.replace("R$ ", "").replace(",", ".")
        );
        paidTotal += isNaN(updated) ? 0 : updated;
      }
    });

    // Atualizar os totais no HTML
    const unpaidTotalElement = document.querySelector("#unpaid-total");
    const paidTotalElement = document.querySelector("#paid-total");

    if (unpaidTotalElement) {
      unpaidTotalElement.textContent = `R$ ${unpaidTotal.toFixed(2)}`;
    }

    if (paidTotalElement) {
      paidTotalElement.textContent = `R$ ${paidTotal.toFixed(2)}`;
    }
  }
}
