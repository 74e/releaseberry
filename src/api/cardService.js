import { api } from './api'

export default {
  saveCardStyle(data) {
    return api.post('game/card', { data })
  }
}
