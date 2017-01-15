import Database   from './Database'
import AddWorkout from './AddWorkout'

export default class ProgressController {
  constructor() {
    this.variables()
    this.update()
    this.listen()
  }

  variables() {
    this.goalRow  = document.querySelector('.card-row.-miles')
    this.daysRow  = document.querySelector('.card-row.-days')
    this.paceRow  = document.querySelector('.card-row.-pace')
    this.otherRow = document.querySelector('.card-row.-other')

    this.goalProgressRing     = this.goalRow.querySelector('.card-progress__completed svg')
    this.goalProgressDisplay  = this.goalRow.querySelectorAll('.card__body')[0]
    this.goalRemainingDisplay = this.goalRow.querySelectorAll('.card__body')[1]

    this.daysProgressRing     = this.daysRow.querySelector('.card-progress__completed svg')
    this.daysProgressDisplay  = this.daysRow.querySelectorAll('.card__body')[0]
    this.daysRemainingDisplay = this.daysRow.querySelectorAll('.card__body')[1]

    this.paceProgressRing     = this.paceRow.querySelector('.card-progress__completed svg')
    this.actualPaceDisplay    = this.paceRow.querySelectorAll('.card__body')[0]
    this.requiredPaceDisplay  = this.paceRow.querySelectorAll('.card__body')[1]
    this.paceIconDisplay      = this.paceRow.querySelector('.card-icon svg use')
    this.paceGoodIcon         = 'check'
    this.paceBadIcon          = 'cross'

    this.totalWorkoutsDisplay = this.otherRow.querySelector('.card__body')

    this.mapStateDisplay      = document.querySelector('.map__current-state__name')
    this.mapStateIcon         = document.querySelector('.map__current-state__icon svg use')
    this.mapRoute             = document.querySelector('.sprite.-progress-route svg')

    this.radialDashArray = 314
    this.routeDashArray  = 807

    this.routeLength = 2474
    this.states = [
      {
        name: 'dc',
        starts: 0
      },
      {
        name: 'virginia',
        starts: 8
      },
      {
        name: 'tennessee',
        starts: 374
      },
      {
        name: 'georgia',
        starts: 586
      },
      {
        name: 'alabama',
        starts: 632
      },
      {
        name: 'mississippi',
        starts: 857
      },
      {
        name: 'louisiana',
        starts: 1079
      },
      {
        name: 'texas',
        starts: 1241
      },
      {
        name: 'mexico',
        starts: 1743
      }
    ]

    //Temporary progress stats
    this.goalTotal = 161
    this.startDate = '2017-1-10'
    this.endDate   = '2017-5-21'
  }

  listen() {
    document.addEventListener('workoutAdded', this.update.bind(this))
  }

  update() {
    this.updateVariables()
    this.calculateProgress()
    this.loadProgress()
  }

  updateVariables() {
    // Progress stats
    this.workouts  = Database.loadWorkouts()
  }

  calculateProgress() {
    this.calculateGoalProgress()
    this.calculateDayProgress()
    this.calculatePaceProgress()
    this.calculateOtherProgress()
    this.calculateMapProgress()
  }

  calculateGoalProgress() {
    let progress = 0
    this.workouts.forEach((num) => {
      progress += parseFloat(num)
    })
    this.goalProgress  = Math.round(progress * 100) / 100
    this.goalRemaining = Math.round((this.goalTotal - this.goalProgress) * 100) / 100
  }

  calculateDayProgress() {
    let startDateMilli   = new Date(this.startDate).getTime()
    let endDateMilli     = new Date(this.endDate).getTime()
    let currentDateMilli = new Date().getTime()
    this.daysTotal       = Math.ceil((endDateMilli - startDateMilli) / (1000 * 60 * 60 * 24))
    this.daysRemaining   = Math.ceil((endDateMilli - currentDateMilli) / (1000 * 60 * 60 * 24)) - 1
    this.daysProgress    = this.daysTotal - this.daysRemaining
  }

  calculatePaceProgress() {
    this.actualPace   = Math.round(this.goalProgress / this.daysProgress * 100) / 100
    this.requiredPace = Math.round(this.goalTotal / this.daysTotal * 100) / 100

    let paceGood = this.actualPace > this.requiredPace ? true : false
    if (paceGood) {
      this.paceIcon = this.paceGoodIcon
    } else {
      this.paceIcon = this.paceBadIcon
    }
  }

  calculateOtherProgress() {
    this.totalWorkouts = this.workouts.length
  }

  calculateMapProgress() {
    let progress = this.goalProgress / this.goalTotal

    // Identify which state we are in
    this.currentState = ''

    for (let i = 0; i < this.states.length; i++) {
      if (progress < (this.states[i].starts / this.routeLength)) {
        this.currentState = this.states[i - 1].name
        break
      } else {
        this.currentState = this.states[this.states.length - 1].name
      }
    }

    // Calculate dash offset for path
    this.routeDashOffset = this.routeDashArray - (this.routeDashArray * progress)
  }

  loadProgress() {
    this.loadGoalProgress()
    this.loadDaysProgress()
    this.loadPaceProgress()
    this.loadOtherProgress()
    this.loadMapProgress()
  }

  loadGoalProgress() {
    this.setProgressRing(this.goalProgress/this.goalTotal, this.goalProgressRing)
    this.goalProgressDisplay.innerHTML  = this.goalProgress
    this.goalRemainingDisplay.innerHTML = this.goalRemaining
  }

  loadDaysProgress() {
    this.setProgressRing(this.daysProgress/this.daysTotal, this.daysProgressRing)
    this.daysProgressDisplay.innerHTML  = this.daysProgress
    this.daysRemainingDisplay.innerHTML = this.daysRemaining
  }

  loadPaceProgress() {
    this.paceIconDisplay.setAttribute('xlink:href','images/icons.svg#' + this.paceIcon)
    this.actualPaceDisplay.innerHTML   = this.actualPace
    this.requiredPaceDisplay.innerHTML = this.requiredPace
  }

  loadOtherProgress() {
    this.totalWorkoutsDisplay.innerHTML = this.totalWorkouts
  }

  loadMapProgress() {
    this.mapStateIcon.setAttribute('xlink:href','images/icons.svg#' + this.currentState)
    this.mapStateDisplay.innerHTML = this.currentState
    setTimeout(() => {
      this.mapRoute.style.strokeDashoffset = this.routeDashOffset
    }, 500)
  }

  setProgressRing(progress, el) {
    let dashOffset = this.radialDashArray - (progress * this.radialDashArray)
    el.setAttribute('stroke-dashoffset', dashOffset)
  }
}