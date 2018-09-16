class Player {
  constructor(id, avatar, game_id, scene) {
    this.scene = scene;
    this.id = id;
    this.avatar = avatar;
    this.game_id = game_id;
    this.spawn = Player.getSpawnPoint();
    this.bullets = [];
    this.rotation = 0;

    this.sprite = Player.players.create(this.spawn.x, this.spawn.y, this.avatar + '1');
    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'rainbow_bomb';

    Player.active_players[this.id] = this;

    debugLog("New player in scene " + scene.name + ' with ID ' + this.id);
  };

  static width() {
    return 212;
  };

  static height() {
    return 125;
  };

  static getSpawnPoint() {
    let spawnX = Player.spawnOffset.x + (Player.width() / 2);
    let spawnY = Player.spawnOffset.y + (Player.height() / 2) 
    let spawn_point = { x: spawnX, y: spawnY };

    debugLog('Player spawn: ' + JSON.stringify(spawn_point));

    if (screen.height > (spawn_point.y + (Player.height() * 2) + 50)) {
      Player.spawnOffset.y += (Player.height() + 10);
    }
    else if (screen.availWidth > (spawn_point.x + Player.width() + 10)) {
      Player.spawnOffset.x += (Player.width() + 10);
      Player.spawnOffset.y = 10;
    }
    else {
      Player.spawnOffset = { x: 10, y: 10 };
    }

    return spawn_point;
  };

  static load(currentScene) {
    Player.players = currentScene.physics.add.group();
    Player.bullets = currentScene.physics.add.group();

    let names = ['appy', 'blaze', 'cloudy', 'codey', 'earnie', 'einstein', 'hootie', 'koa', 'astro']
	names.forEach(function(name) {
	  currentScene.load.animation(name, './animations/players/' + name + '.json'); 
    });

    currentScene.load.animation('rainbow_bomb', 'animations/bullets/rainbow_bomb.json');
  };

  static create(data, currentScene) {
    let player = new Player(data.id, data.avatar, data.game_id, currentScene);
    new Enemy(Enemy.generateId(), currentScene);
  };

  static update() {
    Object.values(Player.activePlayers).forEach(function(player) {
      player.cleanup();
    });
  };

  mayday() {
    this.rotation = 1;
  }

  checkMayday() {
    if (this.rotation >= 6) {
      this.rotation = 0;
      this.sprite.setRotation(this.rotation);
    }
    else if (this.rotation > 0) {
      this.sprite.setRotation(this.rotation);
      this.rotation += 1;
    }
  }

  cleanupBullets() {
    let player = this;

    player.bullets.forEach(function(bullet) {
      if ((bullet.x > screen.width) || (bullet.active == false)) {
        bullet.destroy();
        player.bullets.remove(bullet);
      }
    });
  };

  cleanup() {
    this.cleanupBullets();
    this.checkMayday();
  };

  fire() {
    if (this.bullets.length > 0) {
      return;
    }

    let bullet = Player.bullets.create(this.sprite.x + 50, this.sprite.y + 20, this.bullet + '1');
    this.scene.physics.add.collider(bullet, Enemy.enemies, this.bulletStrike, null, this.scene);
    this.bullets.push(bullet);
    bullet.play(this.bullet);
    bullet.setVelocityX(Player.bulletSpeed);
  };

  bulletStrike(bullet, enemy) {
    enemy.wrapper.die();
    bullet.destroy();
  };
};

Player.active_players = {};
Player.speed = 200;
Player.bulletSpeed = 500;
Player.spawnOffset = { x: 10, y: 10 };
