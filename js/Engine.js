// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];

    // game title
    this.gameTitle = new Text(this.root, 420, 50);
    this.gameTitle.update('Wow! Much game. Very grumpy');

    // variable for lives
    this.lives = 3;

    //  lives
    this.livesDisplay = new Text(this.root, 420, 360);
    this.livesDisplay.update(`${this.lives} lives left`);

    // restart instructions
    this.restartTime = new Text(this.root, 420, 420);

    // game instructions
    this.gameInstruc = new Text(this.root, 10, 520);
    this.gameInstruc.update('Press start to begin the game. Use your left & right arrow keys to avoid grumpy cats! If you hit one, you lose a life.');

    // level
    this.level = 0;

    // score
    this.destroyedEnemy = [];
    this.gameScore = new Text(this.root, 10, 10);

    // start button
    this.startButton = document.createElement('button');
    this.startButton.innerText = 'Start Game';
    this.startButton.style.fontFamily = 'Comic Neue';
    this.startButton.style.backgroundColor = '#ff3399';
    this.startButton.style.color = 'white';
    this.startButton.style.fontSize = '30';
    this.startButton.style.position = 'absolute';
    this.startButton.style.top = '160';
    this.startButton.style.left = '420';
    this.startButton.style.padding = '20 35 20';
    this.startButton.style.zIndex = '110';
    this.root.appendChild(this.startButton);
    this.startButton.addEventListener('click', startGame);

     // reset button
    this.restartButton = document.createElement('button');
    this.restartButton.innerText = 'Restart Game';
    this.restartButton.style.fontFamily = 'Comic Neue';
    this.restartButton.style.backgroundColor = '#ff3399';
    this.restartButton.style.color = 'white';
    this.restartButton.style.fontSize = '30';
    this.restartButton.style.position = 'absolute';
    this.restartButton.style.top = '260';
    this.restartButton.style.left = '420';
    this.restartButton.style.padding = '20';
    this.restartButton.style.zIndex = '110';
    this.root.appendChild(this.restartButton);
    this.restartButton.addEventListener('click', restartGame);
    
    // We add the background image to the game
    addBackground(this.root);

    // update level
    this.levelInterval = null;
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
      this.levelInterval = setInterval(() => {
        this.level++;
      }, 15000)
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
      if (enemy.destroyed){
        this.destroyedEnemy.push(enemy);
      }
      this.gameScore.update(`${this.destroyedEnemy.length}`);
    });

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot, this.level));
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead()){
      this.lives--;
      if (this.lives === 0){
        this.livesDisplay.update(`${this.lives} lives left.`);
        this.restartTime.update('Press the restart button to play again!');
        window.alert('No lives left. Game over!');
        clearInterval(this.levelInterval);
        return;
      } else if (this.lives === 1) {
        this.livesDisplay.update(`${this.lives} life left`);
        window.alert(`Life lost! ${this.lives} life left.`);
      } else {
        this.livesDisplay.update(`${this.lives} lives left`);
        window.alert(`Life lost! ${this.lives} lives left.`);
      }
      }
    
    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.
  isPlayerDead = () => {
    let playerTopPosition = this.player.y;
    let playerLeftPosition = this.player.x;
    return this.enemies.some((enemy) => {
      let enemyHeight = enemy.y + ENEMY_HEIGHT;
      let enemyWidth = enemy.x;
      return enemyWidth === playerLeftPosition && enemyHeight >= playerTopPosition;
  });
};
}