function Unit(name, color, location) {
    this.isPlayer = false;
    this.canBlock = false;
    this.regenerates = false;

    var width = config.unitSize;
    var height = config.unitSize;

    this.baseSpeed = 1;
    this.speedModifier = 1;
    this.recoveryRate = 4;
    this.maxHits = 1;
    this.hits = 0;
    this.baseAccuracy = config.warriorAccuracy;
    this.accuracyModifier = 0;
    this.regenerateTimer = null;
    this.points = 100;

    Sprite.call(this, name, width, height, color, location);
}
Unit.prototype = Object.create(Sprite.prototype);

Unit.prototype.Draw = function() {
    this.DrawSprite();

    // Draw units disc too
    if (this.disc) {
        this.disc.Draw();
    }
}

Unit.prototype.Update = function() {
    // Did we catch our own disc
    if (this.disc) {
        this.CatchDisc();
    }

    // If we don't have a velocity set, do it now
    if (! this.velocity) {
        this.setDestination();
    }

    // Move Unit towards destination
    this.UpdateLocation();

    // Are we at our destination
    if (this.TouchLocation(this.destination)) {
        // console.log(`Unit: ${this.name} got to destination, setting new destination`);
        this.setDestination();
    }

    // Make sure Unit stays on the grid
    var hitEdge = this.bindToGameGrid();
    if (hitEdge[0] || hitEdge[1]) {
        // Hit an edge, make a new destination
        // console.log(`Unit: ${this.name} hit an edge, setting new destination`)
        this.setDestination();
    }

    // Maintain Disc
    if (this.disc) {
        this.UpdateDiscStatus();
        this.disc.Update();
    }
}

Unit.prototype.UpdateLocation = function() {
    this.location.Add(this.velocity);
}

Unit.prototype.UpdateDiscStatus = function() {
    if (this.disc.status == 'held' && ! this.disc.primed) {
        this.disc.primed = true;

        var distance = this.location.Distance(tran.gameGrid.player.location);
        var multiplier = distance / tran.diagonal;
        var time = 1000 + ((2000 + Math.random() * 4000) * multiplier);

        window.setTimeout(this.ThrowDisc.bind(this), time);
    }
}

Unit.prototype.ThrowDisc = function() {
    if (! tran.gameGrid.player) { return; }

    // Aim at player
    var aimFor = Vector.Clone(tran.gameGrid.player.location);

    // Apply Accuracy (somewhere around the player)
    aimFor.points[0] += Math.floor(Math.random() * (100 - this.baseAccuracy + this.accuracyModifier) * 2) - (100 - this.baseAccuracy + this.accuracyModifier);
    aimFor.points[1] += Math.floor(Math.random() * (100 - this.baseAccuracy + this.accuracyModifier) * 2) - (100 - this.baseAccuracy + this.accuracyModifier);

    var direction = Vector.SubFactory(aimFor, this.disc.location);
    direction.Normalize();

    this.disc.Thrown(direction)
}

Unit.prototype.CatchDisc = function() {
    if (this.disc.status == 'returning' && this.Collision(this.disc)) {
        //console.log('Unit: ' + this.name + ' caught disc');
        this.disc.status = 'held';
        this.disc.primed = false;
    }
}

Unit.prototype.setDestination = function() {
    // Try to generate a new location on the grid that is at least ${config.minimumDistance}
    // away from itself. This prevents odd jumpy behavior when the locations are too close.
    // If we try 3 times, stop trying and go with it, don't want to get bogged down.
    var attempts = 0;
    do {
        attempts++;

        // Random location on game grid
        this.destination = Vector.Random2D(this.canvas.width, this.canvas.height);
    } while (this.location.Distance(this.destination) < config.minimumDistance || attempts <= 3)

    var destinationForce = Vector.SubFactory(this.destination, this.location);
    destinationForce.Normalize();
    destinationForce.Mul(this.baseSpeed * this.speedModifier);

    this.velocity = new Vector([0, 0]);
    this.velocity.Add(destinationForce);
    this.velocity.Limit(this.baseSpeed * this.speedModifier);
}

Unit.prototype.Throw = function(direction) {
    if (this.disc && this.disc.status != 'held') return;

    this.disc.status = 'deadly';

    this.disc.Thrown(direction);
}

Unit.prototype.Hit = function(strength) {
    this.hits += strength || 1;
    this.speedModifier = 1 / (this.hits + 1);
    this.setDestination();

    console.log(`${this.name} hit. ${this.maxHits - this.hits} left`);
}

Unit.prototype.Regenerate = function() {
    if (! this.regenerates) return;

    if (this.hits > 0) {
        this.hits -= 1;
        this.speedModifier = (0.5 * this.hits) || 1;
        this.setDestination();

        console.log(`${this.name} regenerated 1 HP`);
    }
}

Unit.prototype.isDead = function() {
    return this.hits >= this.maxHits;
}

Unit.prototype.remove = function() {
    var _ = this;

    if (_.isPlayer) return;

    tran.gameGrid.score += _.points;
    tran.gameGrid.enemies = tran.gameGrid.enemies.filter(function(el) {
        return el !== _;
    });

    console.log(`${_.name} derezzed`);
}

// -------------------------------------------------------------------------- //
// Different Unit Types
// -------------------------------------------------------------------------- //

function Warrior(location) {
    Unit.call(this, 'Warrior', config.warriorColor, location);
    this.disc = new DarkBlue(this);
}
Warrior.prototype = Object.create(Unit.prototype);

function Bulldog(location) {
    Unit.call(this, 'Bulldog', config.bulldogColor, location);
    this.baseSpeed = .75;
    this.regenerates = true;
    this.maxHits = 2;
    this.baseAccuracy = config.bulldogAccuracy;
    this.disc = new DarkBlue(this);
    this.points = 500;
}
Bulldog.prototype = Object.create(Unit.prototype);

function Leader(location) {
    Unit.call(this, 'Leader', config.leaderColor, location);
    this.baseSpeed = 2;
    this.baseAccuracy = config.leaderAccuracy;
    this.points = 1000;

    if (Math.random() * 100 <= config.whiteDiscPercent) {
        this.disc = new White(this);
    }
    else {
        this.disc = new Brown(this);
    }
}
Leader.prototype = Object.create(Unit.prototype);

function Guard(location) {
    Unit.call(this, 'Guard', config.guardColor, location);
    this.baseSpeed = 2;
    this.regenerates = true;
    this.maxHits = 4;
    this.points = 2000;

    this.disc = null; // Has Stun Pole
}
Guard.prototype = Object.create(Unit.prototype);

Guard.prototype.setDestination = function() {
    // Location of player
}
