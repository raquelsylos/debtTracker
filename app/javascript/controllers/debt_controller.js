import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["deleteButton"]

  connect() {
    console.log("Debt controller connected")
    this.setupAlertListeners()
  }

  setupAlertListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-close')) {
        const alert = e.target.closest('.alert')
        if (alert) {
          alert.remove()
        }
      }
    })
  }

  updateTotals() {
    const rows = document.querySelectorAll('tr:not(.table-dark)')
    let totalAmount = 0
    let totalUpdated = 0

    rows.forEach(row => {
      const amountCell = row.cells[2]
      const updatedCell = row.cells[4]

      if (amountCell && updatedCell) {
        // Remove "R$ " e converte para número
        const amount = parseFloat(amountCell.textContent.replace('R$ ', '').replace(',', '.')) || 0
        const updated = parseFloat(updatedCell.textContent.replace('R$ ', '').replace(',', '.')) || 0

        totalAmount += amount
        totalUpdated += updated
      }
    })

    // Atualiza a linha de total
    const totalRow = document.querySelector('tr.table-dark')
    if (totalRow) {
      totalRow.cells[2].textContent = `R$ ${totalAmount.toFixed(2)}`
      totalRow.cells[4].textContent = `R$ ${totalUpdated.toFixed(2)}`
    }
  }

  showMessage(message, type = 'success') {
    const flashDiv = document.getElementById('flash-messages')
    const alert = document.createElement('div')
    alert.className = `alert alert-${type} alert-dismissible fade show`
    alert.role = 'alert'

    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" aria-label="Close"></button>
    `

    flashDiv.appendChild(alert)

    setTimeout(() => {
      if (alert && alert.parentNode) {
        alert.remove()
      }
    }, 5000)
  }

  togglePaid(event) {
    const checkbox = event.target
    const debtId = checkbox.dataset.debtId
    const checked = checkbox.checked

    fetch(`/debts/${debtId}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
      },
      body: JSON.stringify({ debt: { paid: checked } }),
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao atualizar')
      }
    })
    .catch(error => {
      checkbox.checked = !checked
      console.error('Error:', error)
      this.showMessage('Error. Please try again.', 'danger')
    })
  }

  delete(event) {
    event.preventDefault()

    if (confirm('Tem certeza que quer excluir este item?')) {
      const button = event.currentTarget
      const debtId = button.dataset.debtId

      fetch(`/debts/${debtId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
        },
        credentials: 'same-origin'
      })
      .then(response => {
        if (response.ok) {
          const row = button.closest('tr')
          row.remove()
          this.updateTotals() // Atualiza os totais após deletar
          // this.showMessage('Item excluído com sucesso!')
        } else {
          throw new Error('Falha ao excluir item')
        }
      })
      .catch(error => {
        console.error('Erro:', error)
        this.showMessage('Erro. Por favor, tente novamente.', 'danger')
      })
    }
  }
}
