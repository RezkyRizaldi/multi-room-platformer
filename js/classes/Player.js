/** @type {{ position: { x: Number, y: Number }, velocity: { x: Number, y: Number }, width: Number, height: Number, sides: { bottom: Number }, gravity: Number, collisionBlocks: CollisionBlock[], lastDirection: String, preventInput: Boolean }} */
class Player extends Sprite {
	/**
	 *
	 * @param {{ collisionBlocks: CollisionBlock[], imageSrc: String, frameRate: Number, animations: { idleRight: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement }, idleLeft: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement }, runRight: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement }, runLeft: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement }, enterDoor: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement }}}} player
	 */
	constructor({ collisionBlocks = [], imageSrc, frameRate, animations, loop }) {
		super({ imageSrc, frameRate, animations, loop });
		this.position = {
			x: 200,
			y: 200,
		};
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.width = 25;
		this.height = 25;
		this.sides = {
			bottom: this.position.y + this.height,
		};
		this.gravity = 1;
		this.collisionBlocks = collisionBlocks;
		this.lastDirection = 'right';
		this.preventInput = false;
	}

	update() {
		this.position.x += this.velocity.x;

		this.updateHitbox();
		this.checkHorizontalCollisions();
		this.applyGravity();
		this.updateHitbox();
		this.checkVerticalCollisions();
	}

	/**
	 *
	 * @param {{ w: { pressed: Boolean }, a: { pressed: Boolean }, d: { pressed: Boolean }}} keys
	 */
	handleInput(keys) {
		if (this.preventInput) return;

		this.velocity.x = 0;

		switch (true) {
			case keys.d.pressed:
				this.switchSprite('runRight');
				this.velocity.x = 5;
				this.lastDirection = 'right';
				break;

			case keys.a.pressed:
				this.switchSprite('runLeft');
				this.velocity.x = -5;
				this.lastDirection = 'left';
				break;

			default:
				if (this.lastDirection === 'left') this.switchSprite('idleLeft');
				else this.switchSprite('idleRight');
				break;
		}
	}

	/**
	 *
	 * @param {String} name
	 */
	switchSprite(name) {
		if (this.image === this.animations[name].image) return;

		this.currentFrame = 0;
		this.image = this.animations[name].image;
		this.frameRate = this.animations[name].frameRate;
		this.frameBuffer = this.animations[name].frameBuffer;
		this.loop = this.animations[name].loop;
		this.currentAnimation = this.animations[name];
	}

	updateHitbox() {
		this.hitbox = {
			position: {
				x: this.position.x + 58,
				y: this.position.y + 34,
			},
			width: 50,
			height: 53,
		};
	}

	checkHorizontalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (
				this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
				this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
				this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
				this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
			) {
				if (this.velocity.x < 0) {
					const offset = this.hitbox.position.x - this.position.x;

					this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
					break;
				}

				if (this.velocity.x > 0) {
					const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

					this.position.x = collisionBlock.position.x - offset - 0.01;
					break;
				}
			}
		}
	}

	applyGravity() {
		this.velocity.y += this.gravity;
		this.position.y += this.velocity.y;
	}

	checkVerticalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (
				this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
				this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
				this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
				this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
			) {
				if (this.velocity.y < 0) {
					const offset = this.hitbox.position.y - this.position.y;

					this.velocity.y = 0;
					this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
					break;
				}

				if (this.velocity.y > 0) {
					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.velocity.y = 0;
					this.position.y = collisionBlock.position.y - offset - 0.01;
					break;
				}
			}
		}
	}
}
