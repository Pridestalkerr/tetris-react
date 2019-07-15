import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

let tetromino = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	],

	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1]
	],

	[	
		[0, 0, 0],
		[1, 1, 1],
		[1, 0, 0]
	],

	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],

	[
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]
	],

	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0]
	],

	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]
	]
];

class Tetris extends React.Component
{
	constructor(props) 
    {
		super(props);

		let rand = Math.floor(Math.random() * 7);

		this.state = {
			x: Math.floor(this.props.boardSize / 2) - tetromino[rand].length / 2,
			y: -1,
			block: tetromino[rand],
			on: "idle"
		};

		this.table = new Array(this.props.boardSize);
		for (let row = 0; row < this.props.boardSize; ++row)
			this.table[row] = new Array(this.props.boardSize);

		this.checkMove = this.checkMove.bind(this);
		this.moveLeft = this.moveLeft.bind(this);
		this.moveRight = this.moveRight.bind(this);
		this.fall = this.fall.bind(this);
		this.isValid = this.isValid.bind(this);
		this.rotateLeft = this.rotateLeft.bind(this);
		this.awaitEnter = this.awaitEnter.bind(this);
		this.start = this.start.bind(this);
		this.over = this.over.bind(this);
		this.pause = this.pause.bind(this);
		this.renderState = this.renderState.bind(this);
	}

    componentWillMount()
    {
    	window.addEventListener("keydown", this.awaitEnter);
    }

	componentWillUnmount()
    {
		window.removeEventListener("keydown", this.awaitEnter);
		if(this.state.on === "playing")
		{
			window.removeEventListener("keydown", this.checkMove);
			clearInterval(this.fallInterval);
		}
	}

	awaitEnter(event)
	{
		if(event.code === "Enter")
			if(this.state.on === "idle")
				this.start();
			else if(this.state.on === "playing")
				this.pause();
			else if(this.state.on === "pause")
				this.unpause();
			else if(this.state.on === "over")
				this.start();
	}

	start()
	{
		for (let row = 0; row < this.props.boardSize; ++row)
			this.table[row].fill(false);

		window.addEventListener("keydown", this.checkMove);
    	this.fallInterval = setInterval(this.fall, 500);

    	this.setState({
    		on: "playing"
    	});

    	//might want to switch them?
	}

	over()
	{
		window.removeEventListener("keydown", this.checkMove);
		clearInterval(this.fallInterval);

		this.setState({
    		on: "over"
    	});
	}

	pause()
	{
		window.removeEventListener("keydown", this.checkMove);
		clearInterval(this.fallInterval);

		this.setState({
			on: "pause"
		});
	}

	unpause()
	{
		window.addEventListener("keydown", this.checkMove);
    	this.fallInterval = setInterval(this.fall, 500);

    	this.setState({
			on: "playing"
		});
	}

	checkMove(event)
    {
		if(event.code === "ArrowDown") 
			this.fall();
		else if(event.code === "ArrowLeft") 
			this.moveLeft();
		else if(event.code === "ArrowRight") 
			this.moveRight();
		else if(event.code === "KeyA") 
			this.rotateLeft();
		else if(event.code === "KeyD") 
			this.rotateRight();
	}

	moveLeft()
    {
        new Audio(process.env.PUBLIC_URL + "/pop.mp3").play();

        if(this.isValid(this.state.block, this.state.x - 1, this.state.y))
            this.setState({ x: this.state.x - 1 });
	}

	moveRight() 
    {
		new Audio(process.env.PUBLIC_URL + "/pop.mp3").play();

		if (this.isValid(this.state.block, this.state.x + 1, this.state.y))
			this.setState({ x: this.state.x + 1 });
	}

	isValid(block, x, y)
	{
		for(let row = block.length - 1; row >= 0; --row)
			for(let col = 0; col < block.length; ++col)
			{
				if(block[row][col] && (
					row + y >= this.props.boardSize || 
					row + y < 0 ||
					col + x >= this.props.boardSize ||
					col + x < 0 ||
					this.table[row + y][col + x]
				))
					return false;
			}
		return true;
	}

	rotateLeft()
	{
		let size = this.state.block.length;
		let result = new Array(size);
		for(let row = 0; row < size; ++row)
			result[row] = new Array(size);

		for(let row = 0; row < size; ++row)
			for(let col = 0; col < size; ++col)
				result[col][size - row - 1] = this.state.block[row][col];

		if(this.isValid(result, this.state.x, this.state.y))
			this.setState({
				block: result
			});
		else if(this.isValid(result, this.state.x - 1, this.state.y))
			this.setState({
				x: this.state.x - 1,
				block: result
			});
		else if(this.isValid(result, this.state.x + 1, this.state.y))
			this.setState({
				x: this.state.x + 1,
				block: result
			});
	}

	rotateRight()
	{
		let size = this.state.block.length;
		let result = new Array(size);
		for(let row = 0; row < size; ++row)
			result[row] = new Array(size);

		for(let row = 0; row < size; ++row)
			for(let col = 0; col < size; ++col)
				result[size - col - 1][row] = this.state.block[row][col];
		
		if(this.isValid(result, this.state.x, this.state.y))
			this.setState({
				block: result
			});
		else if(this.isValid(result, this.state.x - 1, this.state.y))
			this.setState({
				x: this.state.x - 1,
				block: result
			});
		else if(this.isValid(result, this.state.x + 1, this.state.y))
			this.setState({
				x: this.state.x + 1,
				block: result
			});
	}

	draw()
	{
		for(let row = 0; row < this.state.block.length; ++row)
			for(let col = 0; col < this.state.block.length; ++col)
				if(this.state.block[row][col])
					this.table[row + this.state.y][col + this.state.x] = true;
	}

	fall() 
    {
		//parse bottom to top 
		for(let row = 0; row < this.state.block.length; ++row)
			for(let col = 0; col < this.state.block.length; ++col)
			{
				if(!this.isValid(this.state.block, this.state.x, this.state.y + 1))
				{
					if (this.state.y === -1) 
					{
						this.setState({ on: "over" });
						window.removeEventListener("keydown", this.checkMove);
						clearInterval(this.fallInterval);
					}

					this.draw();

					this.setState({
						x: Math.floor(this.props.boardSize / 2),
						y: -1,
						block: tetromino[Math.floor(Math.random() * 7)]
					});
					return;
				}

			}
		this.setState({ 
                y: this.state.y + 1 
            });
	}

	renderState()
	{
		if(this.state.on === "init")
			return (
				<p> Press START or ENTER to play. </p>
			);
		if(this.state.on === "over")
			return (
				<h1
					style = {{ 
						position: "absolute", 
						color: "#FF0000", 
					}}
				>
					GAME OVER
				</h1>
			);
		if(this.state.on === "pause")
			return (
				<p> UNPAUSE? </p>
			);
	}

	render() 
	{
		return (
			<div 
				style ={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				{
					this.renderState()
				}
				<div
					style = {{
						width: this.props.boardSize * this.props.blockSize,
						height: this.props.boardSize * this.props.blockSize,
						outline: "2px solid #00FF00"
					}}
				>
				{
					this.table.map((line, i) =>
						line.map((ok, j) => {
							if(ok)
								return (
									<div
										key = {
											i.toString() + j.toString()
										}
										style = {{
											position: "absolute",
											width: this.props.blockSize,
											height: this.props.blockSize,
											backgroundColor: "#00FF00",
											marginLeft: j * this.props.blockSize,
											marginTop: i * this.props.blockSize,
											borderStyle: "inset",
											borderColor: "#00FF00"
										}}
									/>
								);
						})
					)
				}
				{
						this.state.block.map((line, i) =>
							line.map((ok, j) => {
								if(ok)
									return (
										<div
											key = {
												i.toString() + j.toString()
											}
											style = {{
												position: "absolute",
												width: this.props.blockSize,
												height: this.props.blockSize,
												backgroundColor: "#00FF00",
												marginLeft: (j+this.state.x) * this.props.blockSize,
												marginTop: (i+this.state.y) * this.props.blockSize,
												borderStyle: "inset",
												borderColor: "#00FF00"
											}}
										/>
									);
							})
						)
				}
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Tetris boardSize = {20} blockSize = {25} />, document.getElementById("board"));
