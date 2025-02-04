// app/javascript/controllers/debt_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
      body: JSON.stringify({ paid: checked }),
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao atualizar status')
      }
    })
    .catch(error => {
      checkbox.checked = !checked
      console.error('Erro:', error)
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
