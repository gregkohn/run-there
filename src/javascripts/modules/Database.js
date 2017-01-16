export default {
  init() {
    this.variables()
    this.workoutsKey = 'workouts'
  },

  variables() {
    this.namespace = 'rt'
  },

  save(key, val) {
    localStorage.setItem(`${this.namespace}__${key}`, JSON.stringify(val))
  },

  load(key) {
    return JSON.parse(localStorage.getItem(`${this.namespace}__${key}`))
  },

  saveWorkout(val) {
    let workouts = this.loadWorkouts()
    workouts.push(val)
    this.save(this.workoutsKey, workouts)
  },

  saveWorkouts(workouts) {
    this.save(this.workoutsKey, workouts)
  },

  loadWorkouts() {
    let workouts = this.load(this.workoutsKey)
    if (workouts == null) {
      workouts = []
    }

    return workouts
  },

  delete() {
  }
}

