import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BOARD_SIZE = 9;
const EMPTY = null;
const PLAYER_ONE = "red";
const PLAYER_TWO = "blue";

const GomokuBoard = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_ONE);
  const [winner, setWinner] = useState(null);

  const handleClick = (row, col) => {
    if (board[row][col] !== EMPTY || winner) return;

    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? currentPlayer : cell))
    );

    setBoard(newBoard);
    checkWinner(newBoard, row, col, currentPlayer);
    setCurrentPlayer(currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE);
  };

  const checkWinner = (board, row, col, player) => {
    if (
      checkDirection(board, row, col, player, 1, 0) || // Horizontal
      checkDirection(board, row, col, player, 0, 1) || // Vertical
      checkDirection(board, row, col, player, 1, 1) || // Diagonal \
      checkDirection(board, row, col, player, 1, -1) // Diagonal /
    ) {
      setWinner(player);
      toast(`${player} wins!`, {
        description: "Congratulations!",
        action: {
          label: "Restart",
          onClick: resetGame,
        },
      });
    }
  };

  const checkDirection = (board, row, col, player, rowDir, colDir) => {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE || board[newRow][newCol] !== player) break;
      count++;
    }
    for (let i = 1; i < 5; i++) {
      const newRow = row - i * rowDir;
      const newCol = col - i * colDir;
      if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE || board[newRow][newCol] !== player) break;
      count++;
    }
    return count >= 5;
  };

  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(EMPTY)));
    setCurrentPlayer(PLAYER_ONE);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mb-4">Gomoku Game</h1>
      <div className="mb-4">Current Turn: <span className={`text-${currentPlayer}`}>{currentPlayer}</span></div>
      <div className="grid grid-cols-9 gap-0 bg-yellow-500">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-10 h-10 border border-black flex items-center justify-center"
              onClick={() => handleClick(rowIndex, colIndex)}
            >
              {cell && <div className={`w-8 h-8 rounded-full bg-${cell}`} />}
            </div>
          ))
        )}
      </div>
      <Button className="mt-4" onClick={resetGame}>Reset Game</Button>
    </div>
  );
};

export default GomokuBoard;