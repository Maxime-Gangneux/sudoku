export function generateSudoku(difficulty = "moyen") {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isValid(row, col, num, grid) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  function fillGrid(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of numbers) {
            if (isValid(row, col, num, grid)) {
              grid[row][col] = num;
              if (fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function copyGrid(grid) {
    return grid.map(row => row.slice());
  }

  function hasUniqueSolution(grid) {
    let count = 0;

    function solve(grid) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(row, col, num, grid)) {
                grid[row][col] = num;
                solve(grid);
                grid[row][col] = 0;
              }
            }
            return;
          }
        }
      }
      count++;
    }

    solve(copyGrid(grid));
    return count === 1;
  }

  function removeNumbers(grid, countToRemove) {
    let attempts = countToRemove;
    while (attempts > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (grid[row][col] !== 0) {
        const backup = grid[row][col];
        grid[row][col] = 0;
        if (!hasUniqueSolution(grid)) {
          grid[row][col] = backup;
        } else {
          attempts--;
        }
      }
    }
  }

  const difficultyMap = {
    facile: 35,
    moyen: 45,
    difficile: 55,
  };

  fillGrid(grid);
  const solution = copyGrid(grid);
  const puzzle = copyGrid(grid);
  removeNumbers(puzzle, difficultyMap[difficulty] || 45);

  return { solution, puzzle };
}
