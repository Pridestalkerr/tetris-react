import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

class Tetris extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			x: Math.floor(this.props.boardSize / 2),
			y: 0,
			on: true
		};

		this.table = new Array(this.props.boardSize);
		for (let itr = 0; itr < this.props.boardSize; ++itr)
			this.table[itr] = new Array(this.props.boardSize).fill(false);

		this.checkMove = this.checkMove.bind(this);
		this.moveLeft = this.moveLeft.bind(this);
		this.moveRight = this.moveRight.bind(this);
		this.fall = this.fall.bind(this);
	}

	componentWillMount() {
		window.addEventListener("keydown", this.checkMove);
		this.fallInterval = setInterval(this.fall, 500);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.checkMove);
		clearInterval(this.fallInterval);
	}

	checkMove(event) {
		if (event.code === "ArrowDown") 
			this.fall();
		else if (event.code === "ArrowLeft") 
			this.moveLeft();
		else if (event.code === "ArrowRight") 
			this.moveRight();
	}

	moveLeft() {
	new Audio(process.env.PUBLIC_URL + "/pop.mp3").play();
	if (!(this.table[this.state.y][this.state.x - 1] || this.state.x === 0))
	this.setState({ x: this.state.x - 1 });
	}

	moveRight() {
		new Audio(process.env.PUBLIC_URL + "/pop.mp3").play();
		if (!(this.table[this.state.y][this.state.x + 1] || this.state.x === this.props.boardSize - 1))
			this.setState({ x: this.state.x + 1 });
	}

	fall() {
		let y = this.state.y + 1;
		if (y >= this.props.boardSize || this.table[y][this.state.x]) 
		{
			new Audio(process.env.PUBLIC_URL + "/pop.mp3").play();
			if (this.state.y === 0) 
			{
				this.setState({ on: false });
				window.removeEventListener("keydown", this.checkMove);
				clearInterval(this.fallInterval);
			}
			this.table[this.state.y][this.state.x] = true;
			this.setState({ x: Math.floor(this.props.boardSize / 2), y: 0 });
		} 
		else 
			this.setState({ y: y });
	}

	render() 
	{
		return (
			<div
				style = {{
					width: this.props.boardSize * this.props.blockSize,
					height: this.props.boardSize * this.props.blockSize,
					backgroundColor: "#000000",
					outline: "2px solid #00FF00"
				}}
			>
			{
				this.table.map((line, i) =>
					line.map((ok, j) => {
						if (ok)
							return (
								<div
									key = {i.toString() + j.toString()}
									style = {{
										position: "absolute",
										width: this.props.blockSize,
										height: this.props.blockSize,
										backgroundColor: "#00FF00",
										marginLeft: j * this.props.blockSize,
										marginTop: i * this.props.blockSize
									}}
								/>
							);
					})
				)
			}
			{
				this.state.on ? 
				(
					<div
						style = {{
							position: "absolute",
							width: this.props.blockSize,
							height: this.props.blockSize,
							backgroundColor: "#00FF00",
							marginLeft: this.state.x * this.props.blockSize,
							marginTop: this.state.y * this.props.blockSize
						}}
					/>
				) : (
					<h1
						style = {{ 
							position: "absolute", 
							color: "#FF0000", 
							margin: "auto" 
						}}
					>
						GAME OVER
					</h1>
				)
			}
			</div>
		);
	}
}

ReactDOM.render(<Tetris boardSize = {11} blockSize = {50} />, document.getElementById("board"));
