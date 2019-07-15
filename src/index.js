import React from "react";
import ReactDOM from "react-dom";
import Tetris from "./components/tetris.jsx";
import "./index.css";

ReactDOM.render(<Tetris boardSize = {20} blockSize = {25}/>, document.getElementById("main"));
