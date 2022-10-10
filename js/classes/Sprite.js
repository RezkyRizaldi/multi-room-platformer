/** @type {{ position: { x: Number, y: Number }, image: HTMLImageElement, loaded: Boolean, frameRate: Number, currentFrame: Number, elapsedFrames: Number, frameBuffer: Number, animations: { idleRight: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }, idleLeft: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }, runRight: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }, runLeft: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }, enterDoor: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }}, loop: Boolean, autoplay: Boolean, currentAnimation: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }|undefined }} */
class Sprite {
	/**
	 *
	 * @param {{ position: { x: Number, y: Number }, imageSrc: String, frameRate: Number, animations: { idleRight: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }, idleLeft: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }, runRight: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }, runLeft: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }, enterDoor: { frameRate: Number, frameBuffer: Number, loop: Boolean, imageSrc: String, image: HTMLImageElement, onComplete(): void, isActive: Boolean }}, frameBuffer: Number, loop: Boolean, autoplay: Boolean }} sprite
	 */
	constructor({ position, imageSrc, frameRate = 1, animations, frameBuffer = 2, loop = true, autoplay = true }) {
		this.position = position;
		this.image = new Image();
		this.image.onload = () => {
			this.loaded = true;
			this.width = this.image.width / this.frameRate;
			this.height = this.image.height;
		};
		this.image.src = imageSrc;
		this.loaded = false;
		this.frameRate = frameRate;
		this.currentFrame = 0;
		this.elapsedFrames = 0;
		this.frameBuffer = frameBuffer;
		this.animations = animations;
		this.loop = loop;
		this.autoplay = autoplay;
		this.currentAnimation = undefined;

		if (this.animations) {
			for (const key in this.animations) {
				if (Object.hasOwnProperty.call(this.animations, key)) {
					const image = new Image();
					image.src = this.animations[key].imageSrc;
					this.animations[key].image = image;
				}
			}
		}
	}

	draw() {
		if (!this.loaded) return;

		const cropBox = {
			position: {
				x: this.width * this.currentFrame,
				y: 0,
			},
			width: this.width,
			height: this.height,
		};

		c.drawImage(this.image, cropBox.position.x, cropBox.position.y, cropBox.width, cropBox.height, this.position.x, this.position.y, this.width, this.height);

		this.updateFrames();
	}

	play() {
		this.autoplay = true;
	}

	updateFrames() {
		if (!this.autoplay) return;

		this.elapsedFrames++;

		if (this.elapsedFrames % this.frameBuffer === 0) {
			if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
			else if (this.loop) this.currentFrame = 0;
		}

		if (this.currentAnimation?.onComplete) {
			if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive) {
				this.currentAnimation.onComplete();
				this.currentAnimation.isActive = true;
			}
		}
	}
}
