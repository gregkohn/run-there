export default {
  init() {
    this.variables()
  },

  variables() {
    this.el           = document.querySelector('.modal-container')
    this.dialog       = this.el.querySelector('.modal-dialog')
    this.titleDisplay = this.dialog.querySelector('.modal-dialog__title')
    this.errorDisplay = this.dialog.querySelector('.modal-dialog__errors')
    this.visibleClass = '-modal-is-active'
    this.invalidClass = '-is-invalid'
  },

  open(title, el) {
    document.body.classList.add(this.visibleClass)
    this.titleDisplay.innerHTML = title
    el.style.display = 'block'
  },

  close(el) {
    this.removeErrors()
    document.body.classList.remove(this.visibleClass)
    setTimeout(() => {
      el.style.display = 'none'
    }, 400)
  },

  showErrors(error) {
    this.el.classList.add(this.invalidClass)
    this.errorDisplay.innerHTML = error
  },

  removeErrors() {
    this.el.classList.remove(this.invalidClass)
    this.errorDisplay.innerHTML = ''
  }
}