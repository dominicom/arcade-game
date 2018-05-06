// Default settings
const tileWidth = 100;
const tileHeight = 80;
const velocity = 100;
//const canvas = document.getElementById('game-client');
const canvas = $('canvas');
const page = $(window);
const game = document.getElementsByTagName('canvas');

const laser = {
  yellow: 'img/yellow-laser.png',
  blue: 'img/blue-laser.png',
  purple: 'img/purple-laser.png'
}
const token = {
  player: 'img/player.png',
  winner: 'img/player-win.png',
  lost: 'img/player-lost.png'
}


// Enemies our player must avoid
class Enemy {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  constructor(x = 0, y = 160, direction, sprite, speed = (velocity + (Math.random() * (velocity * 5)))) {  // sprite = 'img/yellow-laser.png'
    this.x = x; //100;
    this.y = y; //100;
    this.speed = speed; //5;
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
      this.x = this.x + this.speed * dt;
      if (this.x > 500) {
        this.x = -150;
        this.speed = (velocity + (Math.random() * (velocity * 5))); // Random speed
        this.y = 2 * tileHeight + Math.floor((Math.random() * 4)) * tileHeight; // Random Y position update
        this.changeDirection();
      }
    }
    if (this.direction === '<') {
      this.x = this.x - this.speed * dt;
      if (this.x < -150) {
        this.x = 500;
        this.speed = 100 + Math.random() * 500; // Random speed
        this.y = 2 * tileHeight + Math.floor((Math.random() * 4)) * tileHeight; // Random Y position update
        this.changeDirection();
      }
    }
    this.checkCollisions();
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Collision test
  checkCollisions() {

      if (player.y + 120 >= this.y &&
          player.y + 40 <= this.y &&
          player.x <= this.x + 110 &&
          player.x >= this.x - 60) {

        player.lost();
      }

  }


  //This changes enemy (vehicle) direction
  changeDirection(change) {
    change = Math.random();
    (change > 0.5) ? (this.direction = '<') : (this.direction = '>'); // 50% chances to change 'vehicle' direction
  }
}


class Laser extends Enemy {
  constructor(x, y, direction, sprite, speed) {
    super(x, y, speed);
    this.direction = direction;
    this.sprite = sprite;
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor(x = (2 * tileWidth), y = (6 * tileHeight)) {
    this.x = x;
    this.y = y;
    this.move = true;
    this.sprite = token.player;
  }
  update() {
    // iife
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  handleInput(key) {
    if (this.move) {
      (key === 'left') ? (this.x -= tileWidth) : (this.x = this.x);

      (key === 'right') ? (this.x += tileWidth) : (this.x = this.x);

      (key === 'up') ? (this.y -= tileHeight) : (this.y = this.y);

      (key === 'down') ? (this.y += tileHeight) : (this.y = this.y);

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
      this.reset();
            //this.points = this.points + 50;
    }
  }
  reset(x = (2 * tileWidth), y = (6 * tileHeight)) {
    this.move = false;
    setTimeout( function win() {
      player.sprite = token.winner;
    }, 250);
    setTimeout( function resetGame() {
      player.sprite = token.player;
      player.x = x;
      player.y = y;
    }, 1000);
    setTimeout( function startGame() {
      player.move = true;
    }, 1250);
  }
  lost(x = (2 * tileWidth), y = (6 * tileHeight)) {
    this.move = false;
    setTimeout( function win() {
      player.sprite = token.lost;
    }, 250);
    setTimeout( function resetGame() {
      player.sprite = token.player;
      player.x = x;
      player.y = y;
    }, 1000);
    setTimeout( function startGame() {
      player.move = true;
    }, 1250);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let player = new Player();


let yellowLaser = new Laser(-150, 160, '>', laser.yellow);
let blueLaser = new Laser(500, 240, '<', laser.blue);
let purpleLaser = new Laser(-150, 320, '<', laser.purple);


let allEnemies = [];
allEnemies.push(yellowLaser, blueLaser, purpleLaser);






// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  const allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

// Default event prevent methods
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});
document.addEventListener('keydown', function(e) {
    e.preventDefault();
});
