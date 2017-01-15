export default {
  init() {
    this.variables()
  },

  variables() {
    this.el           = document.querySelector('.modal-container')
    this.visibleClass = '-modal-is-active'
  },

  open() {
    document.body.classList.add(this.visibleClass)
  },

  close() {
    document.body.classList.remove(this.visibleClass)
  }
}