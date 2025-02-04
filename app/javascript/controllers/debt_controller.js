// app/javascript/controllers/debt_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  togglePaid(event) {
    const debtId = event.target.dataset.debtId
    const checked = event.target.checked

    fetch(`/debts/${debtId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
      },
      body: JSON.stringify({ paid: checked })
    })
    .then(response => {
      if (!response.ok) {
        event.target.checked = !checked
        alert('Erro ao atualizar status')
      }
    })
  }

  delete(event) {
    event.preventDefault()

    if (confirm('Tem certeza que deseja excluir este item?')) {
      const debtId = event.target.closest('button').dataset.debtId

      fetch(`/debts/${debtId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        credentials: 'same-origin'
      })
      .then(response => {
        if (response.ok) {
          const row = event.target.closest('tr')
          row.remove()
        } else {
          throw new Error('Falha ao excluir')
        }
      })
      .catch(error => {
        console.error('Erro:', error)
        alert('Erro ao excluir item. Por favor, tente novamente.')
      })
    }
  }
}
