import Modal    from './Modal'
import Database from './Database'

export default class EditWorkouts {
  constructor(el) {
    this.el = el
    this.variables()
    this.listen()
  }

  variables() {
    this.launchBtn                = this.el.querySelector('button')
    this.close                    = Modal.el.querySelector('.modal-close')
    this.modalEl                  = Modal.el.querySelector('.modal-dialog__all-workouts')
    this.workoutsList             = this.modalEl.querySelector('ul')

    this.workoutsChangedEventName = 'workoutsChanged'
    this.workoutsChanged          = new Event(this.workoutsChangedEventName)
  }

  listen() {
    this.launchBtn.addEventListener('click', this.start.bind(this))
    this.close.addEventListener('click', this.end.bind(this))
  }

  start() {
    Modal.open('all runs', this.modalEl)
    this.populateWorkouts()

    //Preserve width during session so editing experience is smoother
    let width = Modal.dialog.offsetWidth
    console.log(width)
    Modal.dialog.style.width = `${width}px`
  }

  end() {
    Modal.close(this.modalEl)
    setTimeout(() => {
      Modal.dialog.style.width = 'auto'
    }, 400)
  }

  populateWorkouts() {
    let workouts = Database.loadWorkouts()
    this.workoutsList.innerHTML = ''

    workouts.forEach((workout, i) => {
      let el = document.createElement('li')
      el.innerHTML = `<button data-index="${i}"><span><svg viewBox="0 0 1 1"><use xlink:href='images/icons.svg#cross' /></use></svg></span></button><span class="workout-num">${workout}</span> miles</li>`
      this.workoutsList.appendChild(el)

      el.addEventListener('click', this.editWorkouts.bind(this))
    })
  }

  editWorkouts(e) {
    let removed = e.currentTarget
    let index = parseFloat(removed.querySelector('button').getAttribute('data-index'))
    let workouts = Database.loadWorkouts()
    workouts.splice(index, 1)

    Database.saveWorkouts(workouts)
    this.workoutsList.removeChild(removed)
    document.dispatchEvent(this.workoutsChanged)
  }
}

