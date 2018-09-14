class Player {
  constructor(id, avatar, game_id) {
    this.id = id;
    this.avatar = avatar;
    this.game_id = game_id;
    this.spawn = Player.get_spawn_point();

    this.sprite = Player.players.create(this.spawn.x, this.spawn.y, this.avatar + '1');
    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'rainbow_bomb';

    Player.active_players[id] = this;
  };

  static width() {
    return 212;
  };

  static height() {
    return 125;
  };

  static get_spawn_point() {
    let spawn_point = { x: Player.spawn_offset.x + (Player.width() / 2), y: Player.spawn_offset.y + (Player.height() / 2) };
    console.log('Player spawn: ' + JSON.stringify(spawn_point));

    if (screen.height > (spawn_point.y + (Player.height() * 2) + 50)) {
      Player.spawn_offset.y += (Player.height() + 10);
    }
    else if (screen.availWidth > (spawn_point.x + Player.width() + 10)) {
      Player.spawn_offset.x += (Player.width() + 10);
      Player.spawn_offset.y = 10;
    }
    else {
      Player.spawn_offset = { x: 10, y: 10 };
    }

    return spawn_point;
  };

  static load() {
    Player.players = scene.physics.add.group();
    Player.bullets = scene.physics.add.group();

    let names = ['appy', 'blaze', 'cloudy', 'codey', 'earnie', 'einstein', 'hootie', 'koa', 'astro']
	names.forEach(function(name) {
	  scene.load.animation(name, './animations/players/' + name + '.json'); 
    });

    scene.load.animation('rainbow_bomb', 'animations/bullets/rainbow_bomb.json');
  };

  static create(data) {
    let player = new Player(data.id, data.avatar, data.game_id);
    new Enemy();
  }

  fire() {
    let bullet = Player.bullets.create(this.sprite.x + 50, this.sprite.y + 20, this.bullet + '1');
    scene.physics.add.collider(bullet, enemies, this.bullet_strike, null, scene);
    bullet.play(this.bullet);
    bullet.setVelocityX(Player.bullet_speed);
  };

  bullet_strike(bullet, enemy) {
    enemy.wrapper.die();
    bullet.destroy();
  };
};

Player.active_players = {};
Player.speed = 200;
Player.bullet_speed = 500;
Player.spawn_offset = { x: 10, y: 10 };
