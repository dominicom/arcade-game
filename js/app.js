// Default game settings


const game = {
          startBtn: $('.start'),
            splash: $('.splash'),
        restartBtn: $('.restart'),
               end: $('.game-over'),
            points: document.querySelector('.points'),
         tileWidth: 100,
        tileHeight: 80,
       rightBorder: 500,
        leftBorder: -150,
            hearts: document.getElementById('hearts'),
      finalResults: document.querySelector('.finalResults')
}


const laser = {
  yellow: 'img/yellow-laser.png',
    blue: 'img/blue-laser.png',
  purple: 'img/purple-laser.png',
   green: 'img/green-laser.png'
}
const token = {
  player: 'img/player.png',
  winner: 'img/player-win.png',
    lost: 'img/player-lost.png'
}
const offset = 1.1;
let accelerator = 1.25;

let velocity,
    player,
    yellowLaser,
    blueLaser,
    purpleLaser,
    greenLaser,
    allEnemies = [],
    lives = 6,
    score = 0;



// Enemies our player must avoid
class Enemy {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  constructor(x = 0, y = 160, direction, sprite, speed = (velocity + (Math.random() * velocity * offset))) {
    this.x = x;;
    this.y = y;
    this.speed = speed;
    this.sprite = sprite;
    this.direction = direction;
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.direction === '>') {
      this.x += (this.speed * dt);
      if (this.x > game.rightBorder) {
        this.x = game.leftBorder;
        this.speed = (velocity + (Math.random() * velocity * offset)); // Random speed
        this.y = (game.tileHeight * 2) + Math.floor((Math.random() * 4)) * game.tileHeight; // Random Y position update
        this.changeDirection();
      }
    }
    if (this.direction === '<') {
      this.x = this.x - this.speed * dt;
      if (this.x < game.leftBorder) {
        this.x = game.rightBorder;
        this.speed = (velocity + (Math.random() * velocity * offset)); // Random speed
        this.y = (game.tileHeight * 2) + Math.floor((Math.random() * 4)) * game.tileHeight; // Random Y position update
        this.changeDirection();
      }
    }
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // This changes Enemy (vehicle) direction
  // This gives 50% chances to change 'vehicle' direction in Enemies' update() function
  changeDirection(change) {
    change = Math.random();
    (change > 0.5) ? (this.direction = '<') : (this.direction = '>');
  }
}


class Laser extends Enemy {
  constructor(x, y, direction, sprite, speed) {
    super(x, y, speed);
    this.direction = direction;
    this.sprite = sprite;
  }
}

// Player class
class Player {
  constructor(x = (game.tileWidth * 2), y = (game.tileHeight * 6)) {
    this.x = x;
    this.y = y;
    this.move = true;
    this.hitTest = true;
    this.sprite = token.player;
  }
  update() {
    this.checkCollisions();
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  handleInput(key) {
    if (this.move) {

      (key === 'left') ? (this.x -= game.tileWidth) : (this.x = this.x);

      (key === 'right') ? (this.x += game.tileWidth) : (this.x = this.x);

      (key === 'up') ? (this.y -= game.tileHeight) : (this.y = this.y);

      (key === 'down') ? (this.y += game.tileHeight) : (this.y = this.y);

    }
    // Player move limitation
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > 400) {
      this.x = 400;
    } else if (this.y < 0) {
      this.y = 0;
    } else if (this.y > 480) {
      this.y = 480;
    }
    if (this.y <= 0) {
      this.reset('winner');
      this.score(100);
    }
  }
  checkCollisions() {
    for ( let i = 0; i < allEnemies.length; i++ ) {
      let boundingBox = this.y + 120 >= allEnemies[i].y &&
                        this.y + 40 <= allEnemies[i].y &&
                        this.x <= allEnemies[i].x + 110 &&
                        this.x >= allEnemies[i].x - 60;

      if (boundingBox) {
        // hitTest condition prevents updating too much data from ckeckCollisions()
        if (this.hitTest) {
          lives = lives - 1;
          console.log('hit!')
          this.reset('lost');
        }
        this.hitTest = false;
      }
    }
  }
  // Restart player when catch the 'Water' (token.winner)
  // or when collided with 'vehicules' (token.lost)
  reset(type, x = (game.tileWidth * 2), y = (game.tileHeight * 6)) {
    this.move = false;
    setTimeout( () => {
      this.sprite = token[type];
    }, 250);
    setTimeout( () => {
      this.sprite = token.player;
      this.x = x;
      this.y = y;
    }, 1000);
    setTimeout( () => {
      // if player lost will initiate gameOver() later
      if (type === 'lost') {
        this.lose();
      }
      this.move = true;
      this.hitTest = true;
    }, 1250);
  }
  score(points) {
    score += points;
    game.points.innerHTML = `${score}`;
    velocity *= accelerator;

    // initiate level hard
    if (velocity > 700) {
      maxLevel();
    }
  }
  lose() {
    game.hearts.removeChild(game.hearts.childNodes[lives]);
    if (lives === 0) {
      game.hearts.innerHTML = ' ';
      gameOver();
    }
  }
}









// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



let initiate = () => {
  velocity = 100;
  player = new Player();
  yellowLaser = new Laser(-150, 160, '>', laser.yellow);
  blueLaser = new Laser(500, 240, '<', laser.blue);
  purpleLaser = new Laser(-150, 320, '>', laser.purple);
  livesAmount();
};

let livesAmount = () => {

  for (let l = 1; l < lives + 1; l++) {
    let life = document.createElement('LI');
    console.log(l);
    game.hearts.appendChild(life);
    life.innerHTML = '<img src="img/heart.svg">';
  }
}




let startGame = () => {
  allEnemies.push(yellowLaser, blueLaser, purpleLaser);
};

let maxLevel = () => {
  accelerator = 1.05;
  greenLaser = new Laser(-150, 400, '<', laser.green);
  allEnemies.push(greenLaser);
}

let gameOver = () => {
  game.finalResults.innerHTML = `${score} points!`
  game.end.slideDown(200);
}

let resetGame = () => {
  allEnemies = [];
  velocity = 0;
  score = 0;
  player = null;
  lives = 6;
  initiate();
  startGame();
};

// SETUP GAME
initiate();
game.end.slideUp();






// Handling popups with jQuery
$(function() {
  game.startBtn.on('click', function() {
    console.log('start');
    game.splash.slideUp(200);
    startGame();
  });

  game.restartBtn.on('click', function() {
    resetGame();
    game.end.slideUp(200);
  });
});



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
  const allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});


// Default event prevent defaults methods
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});
document.addEventListener('keydown', function(e) {
    e.preventDefault();
});
