export class Position {
	map: number;
	x: number;
	y: number;
	z: number;

	constructor(map: number, x: number, y: number, z: number) {
		this.map = map;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toString(): string {
		return `${this.map},${this.x},${this.y},${this.z}`;
	}
}
