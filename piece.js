class Piece{
	entropy;
	open = false;
	constructor(x, y, nElm){
		this.entropy = Array.from(Array(nElm).keys());
		this.x = x;
		this.y = y;
	}
}
