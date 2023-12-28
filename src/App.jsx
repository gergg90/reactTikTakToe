import { useState } from "react";
import confetti from "canvas-confetti";
import Square from "./components/Square";
import { TURNS } from "./constans";
import { checkWinner, checkEndGame } from "./logic/board";
import WinnerModal from "./components/WinnerModal";
import { saveGameToStorage, resetGameStorage } from "./logic/storage";

import "./App.css";

function App() {
  // states
  const [board, setBoard] = useState(() => {
    const boardStorage = window.localStorage.getItem("board");
    if (boardStorage) return JSON.parse(boardStorage);
    return Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnStorage = window.localStorage.getItem("turn");
    return turnStorage ?? TURNS.X;
  });

  const [winner, setWinner] = useState(null);

  // actualizacion de tablero
  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;

    saveGameToStorage({
      board: newBoard,
      turn: newTurn,
    });

    setTurn(newTurn);

    const newWiner = checkWinner(newBoard);
    if (newWiner) {
      confetti();
      setWinner(newWiner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    resetGameStorage();
  };

  return (
    <main className="board">
      <h1>{TURNS.X} vs {TURNS.O}</h1>
      <button onClick={resetGame}>Reset the fucking game.</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal winner={winner} resetGame={resetGame} />
    </main>
  );
}

export default App;
