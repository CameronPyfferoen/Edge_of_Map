import Enemy from './Enemy'

class Crab_Blue extends Enemy
{
  constructor ( game ) {
    super ( game )
    Enemy.key = 'bluecrab'
    this.setupAnimations()
  }

  setupAnimations()
  {
    this.setupAnimations.add('swim', [0], 1, false)
  }
}

export default Crab_Blue
