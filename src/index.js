import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

class Grid extends React.Component{
	constructor(props)
	{
		super(props);

		this.state = {x: 5, y: 0, on: 1};
		
		this.coordinates = [];
		
		this.table = new Array(11);
		for(let itr = 0; itr < 11; ++itr)
			this.table[itr] = new Array(11).fill(false);
		
		this.newBlock = this.newBlock.bind(this);
		this.move = this.move.bind(this);
		this.fall = this.fall.bind(this);
	}
	newBlock(props)
	{
		this.table[props.y][props.x] = true;
		this.coordinates.push({x: props.x, y: props.y});
	}
	move(event)
	{
		var audio = new Audio(process.env.PUBLIC_URL + "/pop.mp3");
		audio.play();

		if(event.code === "ArrowDown")
		{
			this.fall();
			return;
		}

		let x = this.state.x;
		if(event.code === "ArrowLeft")
			--x;
		else if(event.code === "ArrowRight")
			++x;
		if(!(x >= 11 || x < 0 || this.table[this.state.y][x] === true))
			this.setState({x: x});
	}

	fall()
	{
		let y = this.state.y + 1;
		if(y >= 11 || this.table[y][this.state.x] === true)
		{
			var audio = new Audio(process.env.PUBLIC_URL + "/pop.mp3");
			audio.play();
			if(this.state.y === 0)
			{
				console.log("GAME OVER");
				this.setState({on: 0});
				window.removeEventListener("keydown", this.move);
				clearInterval(this.fallInterval);
			}
			this.newBlock({x: this.state.x, y: this.state.y});
			this.setState({x: 5, y: 0});
		}
		else
			this.setState({y: y});
	}

	componentWillMount()
	{
		window.addEventListener("keydown", this.move);
		this.fallInterval = setInterval(this.fall, 500);
	}

	componentWillUnmount()
	{
		window.removeEventListener("keydown", this.move);
		clearInterval(this.fallInterval);
	}

	render()
	{
		return (
			<div style = {{width: 550, height: 550, backgroundColor: "#000000"}}>
				{this.coordinates.map(({ x, y }, index) => <div key = {index} style = {{position: "absolute", width: 50, height: 50, backgroundColor: "#00FF00", marginLeft: x * 50, marginTop: y * 50}}></div>)}
				{this.state.on === 1 && <div style = {{position: "absolute", width: 50, height: 50, backgroundColor: "#00FF00", marginLeft: this.state.x * 50, marginTop: this.state.y * 50}}></div>}
				{this.state.on === 0 && <h1 style = {{position: "absolute", color: "#FF0000"}} >GAME OVER</h1>}
			</div> );
	}
}

ReactDOM.render(<Grid/>, document.getElementById("board"));