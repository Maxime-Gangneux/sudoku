import { useState, useEffect } from "react";
import { generateSudoku } from "./sudoku.js";
import './App.css';

function App() {
  const [difficulty, setDifficulty] = useState("moyen");
  const [{ puzzle, solution }, setSudoku] = useState(() => generateSudoku(difficulty));
  const [grid, setGrid] = useState(puzzle);
  const [selectedCell, setSelectedCell] = useState(null);
  const [win, setWin] = useState(false);

  useEffect(() => {
    const generated = generateSudoku(difficulty);
    setSudoku(generated);
    setGrid(generated.puzzle);
    setSelectedCell(null);
    setWin(false);
  }, [difficulty]);

  const getUsedNumbers = (grid) => {
    const counts = Array(10).fill(0);
    grid.forEach(row => {
      row.forEach(num => {
        if (num !== 0) counts[num]++;
      });
    });
    return counts;
  };

  const wincondition = (grid, solution) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] !== solution[i][j]) return false;
      }
    }
    return true;
  };

  const winAnimation = () => {
    let count = 0;
    const interval = setInterval(() => {
      const randRow = Math.floor(Math.random() * 9);
      const randCol = Math.floor(Math.random() * 9);
      setSelectedCell({ row: randRow, col: randCol });
      count++;
      if (count >= 12) {
        clearInterval(interval);
        setSelectedCell(null);
      }
    }, 250);
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleRelancer = () => {
    const generated = generateSudoku(difficulty);
    setSudoku(generated);
    setGrid(generated.puzzle);
    setSelectedCell(null);
    setWin(false);
  };

  const selectedValue = selectedCell ? grid[selectedCell.row][selectedCell.col] : null;

  const handleNumberClick = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (puzzle[row][col] !== 0) return;

    if (solution[row][col] === num) {
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? num : cell))
      );
      setGrid(newGrid);
      if (wincondition(newGrid, solution)) {
        setWin(true);
        winAnimation();
      }
    } else {
      alert("Mauvais chiffre !");
    }
  };

  const usedCounts = getUsedNumbers(grid);

  return (
    <div className="App">
      <header>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="facile">Facile</option>
          <option value="moyen">Moyen</option>
          <option value="difficile">Difficile</option>
        </select>
        <button onClick={handleRelancer}>Relancer</button>
      </header>
      <div className="body">
        <div className="sudoku-grid">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selectedCell && selectedCell.row === r && selectedCell.col === c;
              const isSameNumber = selectedValue && cell === selectedValue && cell !== 0;
              const highlight = isSelected || isSameNumber;
              const isFixed = puzzle[r][c] !== 0;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`cell ${highlight ? "highlight" : ""} ${cell === 0 ? "empty" : ""} ${isFixed ? "fixed" : ""}`}
                  onClick={() => handleCellClick(r, c)}
                >
                  {cell !== 0 ? cell : ""}
                </div>
              );
            })
          )}
        </div>
        <div className="slecteurdechiffre">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            usedCounts[num] < 9 && (
              <button
                key={num}
                className="chiffre"
                onClick={() => handleNumberClick(num)}
              >
                {num}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
