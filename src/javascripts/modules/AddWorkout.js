import Modal    from './Modal'
import Database from './Database'

export default class AddWorkout {
  constructor(el) {
    this.el = el
    this.variables()
    this.listen()
  }

  variables() {
    this.launchBtn             = this.el.querySelector('button')
    this.input                 = Modal.el.querySelector('input')
    this.submitBtn             = Modal.el.querySelector('button')
    this.close                 = Modal.el.querySelector('.modal-close')

    this.workoutAddedEventName = 'workoutAdded'
    this.workoutAdded          = new Event(this.workoutAddedEventName)
  }

  listen() {
    this.launchBtn.addEventListener('click', this.start.bind(this))
    this.submitBtn.addEventListener('click', this.submit.bind(this))
    this.close.addEventListener('click', this.end.bind(this))
  }

  start() {
    Modal.open()
    this.input.focus()
  }

  end() {
    Modal.close()
    this.input.value = ''
  }

  submit() {
    let val = this.input.value
    Database.saveWorkout(val)
    document.dispatchEvent(this.workoutAdded)
    this.end()
  }
}