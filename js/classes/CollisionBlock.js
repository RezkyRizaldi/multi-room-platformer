/** @type {{ position: { x: Number, y: Number }, width: Number, height: Number }} */
class CollisionBlock {
	/**
	 *
	 * @param {{ position: { x: Number, y: Number }}} collisionBlock
	 */
	constructor({ position }) {
		this.position = position;
		this.width = 64;
		this.height = 64;
	}

	draw() {
		c.fillStyle = 'rgba(255, 0, 0, 0.5)';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}
