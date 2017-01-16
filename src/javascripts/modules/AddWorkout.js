import Modal    from './Modal'
import Database from './Database'

export default class AddWorkout {
  constructor(el) {
    this.el = el
    this.variables()
    this.listen()
  }

  variables() {
    this.launchBtn                = this.el.querySelector('button')
    this.input                    = Modal.el.querySelector('input')
    this.submitBtn                = Modal.el.querySelector('button')
    this.close                    = Modal.el.querySelector('.modal-close')
    this.modalEl                  = Modal.el.querySelector('.modal-dialog__form')

    this.workoutsChangedEventName = 'workoutsChanged'
    this.workoutsChanged          = new Event(this.workoutsChangedEventName)
  }

  listen() {
    this.launchBtn.addEventListener('click', this.start.bind(this))
    this.submitBtn.addEventListener('click', this.submit.bind(this))
    this.close.addEventListener('click', this.end.bind(this))
    this.input.addEventListener('focus', this.onFocus.bind(this))
  }

  start() {
    Modal.open('new run', this.modalEl)
    this.input.focus()
  }

  end() {
    Modal.close(this.modalEl)
    this.input.value = ''
  }

  submit() {
    let val = this.input.value
    if (this.validate(val)) {
      Database.saveWorkout(val)
      document.dispatchEvent(this.workoutsChanged)
      this.end()
    }
  }

  validate(val) {
    val = parseFloat(val)
    if (!isNaN(val) && (val > 0)) {
      return true
    }

    Modal.showErrors('Not a valid number')
    return false
  }

  onFocus() {
    Modal.removeErrors()
  }
}