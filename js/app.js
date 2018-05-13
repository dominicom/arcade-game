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
      finalResults: document.querySelector('.final-results'),
               pad: document.getElementById('game-pad')
}
const control = {
                up: document.getElementById('up'),
              down: document.getElementById('down'),
              left: document.getElementById('left'),
             right: document.getElementById('right')
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
const offset = 0.75;
let accelerator = 1.15;

let velocity,
    player,
    yellowLaser,
    blueLaser,
    purpleLaser,
    greenLaser,
    allEnemies = [],
    lives = 6,
    score = 0,
    ratingPoints = 50;



// Enemies our player must avoid
class Enemy {
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
    // Player gets to the "water"
    if (this.move && this.y <= 0) {
      this.reset('winner');
    }
  }
  // Draw the player on the screen, required method for game
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

  }
  checkCollisions() {
    for ( let i = 0; i < allEnemies.length; i++ ) {
      let boundingBox = this.y + 120 >= allEnemies[i].y &&
                        this.y + 40 <= allEnemies[i].y &&
                        this.x <= allEnemies[i].x + 110 &&
                        this.x >= allEnemies[i].x - 60;

      if (boundingBox) {
        // hitTest prevents updating too much data from ckeckCollisions()
        if (this.hitTest) {
          this.move = false;
          lives = lives - 1;
          this.reset('lost');
        }
        this.hitTest = false;
      }
    }
  }
  // Restart player when catch the 'water' (token.winner)
  // or when collided with 'vehicules' (token.lost)
  reset(type, x = (game.tileWidth * 2), y = (game.tileHeight * 6)) {
    this.move = false;
    if (type === 'winner') {
      this.score(ratingPoints);
    }
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
    if (score > 250) {
      levelUp();
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

// SETUP GAME

let initiate = () => {
  velocity = 100;
  player = new Player();
  yellowLaser = new Laser(-150, 160, '>', laser.yellow);
  blueLaser = new Laser(500, 240, '<', laser.blue);
  purpleLaser = new Laser(-150, 320, '>', laser.purple);
  livesAmount();
};

let levelUp = (color) => {
  accelerator = 1.01;
  ratingPoints *= 2;
  const random = ['green', 'yellow', 'blue', 'purple'];


  color = laser[random[Math.floor((Math.random() * random.length))]];
  newLaser = new Laser(-150, 400, '>', color);

  allEnemies.push(newLaser);
}

let livesAmount = () => {
  for (let l = 1; l < lives + 1; l++) {
    let life = document.createElement('LI');
    game.hearts.appendChild(life);
    life.innerHTML = '<img src="img/heart.svg">';
  }
}




let startGame = () => {
  allEnemies.push(yellowLaser, blueLaser, purpleLaser);
};

let gameOver = () => {
  game.finalResults.innerHTML = `${score} points!`
  game.end.slideDown(200);
}

let resetGame = () => {
  allEnemies = [];
  velocity = 0;
  ratingPoints = 50;
  score = 0;
  player = null;
  lives = 6;
  game.points.innerHTML = `${score}`;
  initiate();
  startGame();
};


initiate();
game.end.slideUp();






// Handling popups with jQuery
$(function() {
  game.startBtn.on('click', function() {
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


// This listens for buttons presses and sends the keys to
// Player.handleInput() method. This will work only on mobile devices!
gamePad = () => {
  game.pad.onclick = (arrow) => {
    arrow = event.target.getAttribute('id');
    const allowedClicks = {
         left: 'left',
           up: 'up',
        right: 'right',
         down: 'down'
    };
    player.handleInput(allowedClicks[arrow]);
  };
}
// Simple detection of mobile device
if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  $('.controls').removeClass('hide');
  gamePad();
}




// Default event prevent defaults methods
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});
document.addEventListener('keydown', function(e) {
    e.preventDefault();
});
