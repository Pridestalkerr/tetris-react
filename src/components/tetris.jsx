import React from "react";
import "./tetris.css";

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

export default
class Tetris extends React.Component
{
    constructor(props) 
    {
        super(props);

        this.state = {
            block: [[0]],
            x: 0,
            y: 0,
            on: "init"
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
        this.unpause = this.unpause.bind(this);
        this.renderUserInterface = this.renderUserInterface.bind(this);
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
            if(this.state.on === "init")
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
        this.score = 0;

        for(let row = 0; row < this.props.boardSize; ++row)
            this.table[row].fill(false);

        let rand = Math.floor(Math.random() * tetromino.length);

        this.setState({
            x: Math.floor(this.props.boardSize / 2) - Math.ceil(tetromino[rand].length / 2),
            y: -1,
            block: tetromino[rand],
            on: "playing"
        });

        window.addEventListener("keydown", this.checkMove);
        this.fallInterval = setInterval(this.fall, 500);
    }

    over()
    {
        this.setState({
            block: [[0]],
            x: 0,
            y: 0,
            on: "over"
        });

        window.removeEventListener("keydown", this.checkMove);
        clearInterval(this.fallInterval);
    }

    pause()
    {
        this.setState({
            on: "pause"
        });

        window.removeEventListener("keydown", this.checkMove);
        clearInterval(this.fallInterval);
    }

    unpause()
    {
        this.setState({
            on: "playing"
        });

        window.addEventListener("keydown", this.checkMove);
        this.fallInterval = setInterval(this.fall, 500);
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

        if(this.isValid(this.state.block, this.state.x + 1, this.state.y))
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
        new Audio(process.env.PUBLIC_URL + "/pop.mp3").play();

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
        new Audio(process.env.PUBLIC_URL + "/pop.mp3").play();

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

    pop()
    {
        let drop = new Array(this.table.length).fill(0);
        let score = 0;

        for(let row = this.table.length - 1; row >= 0; --row)
        {
            let full = true;
            for(let col = 0; col < this.table.length; ++col)
            {
                if(!this.table[row][col])
                {
                    full = false;
                    break;
                }
            }
            if(full)
            {
                drop[row] = -1;
                for(let itr = 0; itr < row; ++itr)
                    ++drop[itr];
                score = Math.max(Math.ceil(2.5 * score), 100);
            }
        }
        for(let row = this.table.length - 1; row >= 0; --row)
        {
            if(drop[row] > 0)
                this.table[row + drop[row]] = this.table[row].slice(0);
        }
        return score;
    }

    fall() 
    {
        for(let row = 0; row < this.state.block.length; ++row)
            for(let col = 0; col < this.state.block.length; ++col)
            {
                if(!this.isValid(this.state.block, this.state.x, this.state.y + 1))
                {
                    if (this.state.y === -1) 
                    {
                        this.over();
                    }

                    this.draw();

                    this.score += this.pop();

                    let rand = Math.floor(Math.random() * tetromino.length);

                    this.setState({
                        x: Math.floor(this.props.boardSize / 2) - Math.ceil(tetromino[rand].length / 2),
                        y: -1,
                        block: tetromino[rand],
                    });

                    return;
                }
            }
        this.setState({ 
            y: this.state.y + 1 
        });
    }

    renderUserInterface()
    {
        if(this.state.on === "init")
            return (
                <div
                    id = "tetrisUserInterface"
                    style = {{ 
                        width: this.props.boardSize * this.props.blockSize,
                        height: this.props.boardSize * this.props.blockSize,
                    }}
                >
                    <p className = "tetrisText">
                        Press ENTER to START
                    </p>
                </div>
            );
        if(this.state.on === "over")
            return (
                <div
                    id = "tetrisUserInterface" 
                    style = {{ 
                        width: this.props.boardSize * this.props.blockSize,
                        height: this.props.boardSize * this.props.blockSize,
                    }}
                >
                    <div className = "tetrisText">
                        <p>
                            GAME OVER
                        </p>
                        <p>
                            Press ENTER to PLAY AGAIN
                        </p>
                    </div>
                    <p className = "tetrisScore">
                        {this.score}
                    </p>
                </div>
            );
        if(this.state.on === "pause")
            return (
                <div
                    id = "tetrisUserInterface" 
                    style = {{ 
                        width: this.props.boardSize * this.props.blockSize,
                        height: this.props.boardSize * this.props.blockSize,
                    }}
                >
                    <p className = "tetrisText">
                        Press ENTER to UNPAUSE
                    </p>
                    <p className = "tetrisScore">
                        {this.score}
                    </p>
                </div>
            );
        if(this.state.on === "playing")
            return (
                <div
                    id = "tetrisUserInterface"
                    style = {{ 
                        width: this.props.boardSize * this.props.blockSize,
                        height: this.props.boardSize * this.props.blockSize,
                    }}
                >
                    <p className = "tetrisScore">
                        {this.score}
                    </p>
                </div>
            );
    }

    render() 
    {
        return (
            <div 
                id = "tetrisBoard"
                style ={{
                    width: this.props.boardSize * this.props.blockSize,
                    height: this.props.boardSize * this.props.blockSize,
                }}
            >
                <div
                    id = "tetrisBoardGrid"
                    style = {{
                        width: this.props.boardSize * this.props.blockSize,
                        height: this.props.boardSize * this.props.blockSize,
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
                                        className = "tetrisBlock"
                                        style = {{
                                            width: this.props.blockSize,
                                            height: this.props.blockSize,
                                            marginLeft: j * this.props.blockSize,
                                            marginTop: i * this.props.blockSize,
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
                                        className = "tetrisBlock"
                                        style = {{
                                            width: this.props.blockSize,
                                            height: this.props.blockSize,
                                            marginLeft: (j+this.state.x) * this.props.blockSize,
                                            marginTop: (i+this.state.y) * this.props.blockSize,
                                        }}
                                    />
                                );
                        })
                    )
                }
                </div>
                {
                    this.renderUserInterface()
                }
            </div>
        );
    }
}