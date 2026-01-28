'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// テトリミノの形状定義
type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

interface Position {
  x: number;
  y: number;
}

interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
}

// 各テトリミノの形状と色
const TETROMINOS: Record<TetrominoType, Omit<Tetromino, 'type'>> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a000f0',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00f000',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f00000',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000f0',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f0a000',
  },
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

// ランダムなテトリミノを生成
function createRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    type,
    ...TETROMINOS[type],
  };
}

// 空のボードを生成
function createEmptyBoard(): number[][] {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => EMPTY_CELL)
  );
}

// テトリミノを回転
function rotateTetromino(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => 0)
  );

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rotated[col][rows - 1 - row] = shape[row][col];
    }
  }

  return rotated;
}

export default function TetrisPage() {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard());
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(createRandomTetromino());
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 3, y: 0 });
  const [nextTetromino, setNextTetromino] = useState<Tetromino>(createRandomTetromino());
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const moveDownRef = useRef<() => void>();

  // 衝突判定
  const checkCollision = useCallback(
    (tetromino: Tetromino, position: Position): boolean => {
      for (let row = 0; row < tetromino.shape.length; row++) {
        for (let col = 0; col < tetromino.shape[row].length; col++) {
          if (tetromino.shape[row][col]) {
            const newX = position.x + col;
            const newY = position.y + row;

            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && board[newY][newX] !== EMPTY_CELL)
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [board]
  );

  // ラインクリア判定
  const clearLines = useCallback((currentBoard: number[][]): { newBoard: number[][]; linesCleared: number } => {
    const newBoard = currentBoard.map(row => [...row]);
    let linesCleared = 0;

    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (newBoard[row].every((cell) => cell !== EMPTY_CELL)) {
        newBoard.splice(row, 1);
        newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => EMPTY_CELL));
        linesCleared++;
        row++; // 同じ行を再チェック
      }
    }

    return { newBoard, linesCleared };
  }, []);

  // テトリミノを固定
  const lockTetromino = useCallback(() => {
    const newBoard = board.map((row) => [...row]);

    for (let row = 0; row < currentTetromino.shape.length; row++) {
      for (let col = 0; col < currentTetromino.shape[row].length; col++) {
        if (currentTetromino.shape[row][col]) {
          const x = currentPosition.x + col;
          const y = currentPosition.y + row;
          if (y >= 0) {
            newBoard[y][x] = 1;
          }
        }
      }
    }

    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);
    setScore((prev) => prev + linesCleared * 100);

    // 新しいテトリミノ
    const newNext = createRandomTetromino();
    setCurrentTetromino(nextTetromino);
    setNextTetromino(newNext);
    setCurrentPosition({ x: 3, y: 0 });

    // ゲームオーバー判定
    if (checkCollision(nextTetromino, { x: 3, y: 0 })) {
      setGameOver(true);
    }
  }, [board, currentTetromino, currentPosition, nextTetromino, clearLines, checkCollision]);

  // テトリミノを移動
  const moveTetromino = useCallback(
    (dx: number, dy: number) => {
      const newPosition = { x: currentPosition.x + dx, y: currentPosition.y + dy };
      if (!checkCollision(currentTetromino, newPosition)) {
        setCurrentPosition(newPosition);
        return true;
      }
      return false;
    },
    [currentPosition, currentTetromino, checkCollision]
  );

  // テトリミノを回転
  const rotate = useCallback(() => {
    const rotated = { ...currentTetromino, shape: rotateTetromino(currentTetromino.shape) };
    if (!checkCollision(rotated, currentPosition)) {
      setCurrentTetromino(rotated);
    }
  }, [currentTetromino, currentPosition, checkCollision]);

  // ハードドロップ
  const hardDrop = useCallback(() => {
    let newY = currentPosition.y;
    while (!checkCollision(currentTetromino, { x: currentPosition.x, y: newY + 1 })) {
      newY++;
    }
    setCurrentPosition({ ...currentPosition, y: newY });
    lockTetromino();
  }, [currentPosition, currentTetromino, checkCollision, lockTetromino]);

  // キーボード操作
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveTetromino(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveTetromino(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveTetromino(0, 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, isPaused, moveTetromino, rotate, hardDrop]);

  // ゲームループ
  useEffect(() => {
    moveDownRef.current = () => {
      const moved = moveTetromino(0, 1);
      if (!moved) {
        lockTetromino();
      }
    };
  }, [moveTetromino, lockTetromino]);

  useEffect(() => {
    if (gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      moveDownRef.current?.();
    }, 1000);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameOver, isPaused]);

  // ボードを描画用に結合
  const displayBoard = board.map((row) => [...row]);
  for (let row = 0; row < currentTetromino.shape.length; row++) {
    for (let col = 0; col < currentTetromino.shape[row].length; col++) {
      if (currentTetromino.shape[row][col]) {
        const x = currentPosition.x + col;
        const y = currentPosition.y + row;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          displayBoard[y][x] = 1;
        }
      }
    }
  }

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentTetromino(createRandomTetromino());
    setNextTetromino(createRandomTetromino());
    setCurrentPosition({ x: 3, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="flex gap-8">
        {/* メインゲームエリア */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">TETRIS</h1>

          {/* ゲームボード */}
          <div
            className="bg-slate-950 rounded-lg p-2 border-4 border-slate-700"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
              gap: '2px',
            }}
          >
            {displayBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                let bgColor = 'bg-slate-900';
                let borderColor = 'border-slate-800';

                if (cell !== EMPTY_CELL) {
                  // 現在のテトリミノの色を適用
                  const isCurrentPiece =
                    rowIndex >= currentPosition.y &&
                    rowIndex < currentPosition.y + currentTetromino.shape.length &&
                    colIndex >= currentPosition.x &&
                    colIndex < currentPosition.x + currentTetromino.shape[0].length &&
                    currentTetromino.shape[rowIndex - currentPosition.y][
                      colIndex - currentPosition.x
                    ] === 1;

                  if (isCurrentPiece) {
                    bgColor = 'bg-opacity-90';
                    borderColor = 'border-opacity-100';
                  } else {
                    bgColor = 'bg-slate-600';
                    borderColor = 'border-slate-500';
                  }
                }

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-6 h-6 ${bgColor} border ${borderColor} rounded-sm transition-colors`}
                    style={
                      cell !== EMPTY_CELL &&
                      rowIndex >= currentPosition.y &&
                      rowIndex < currentPosition.y + currentTetromino.shape.length &&
                      colIndex >= currentPosition.x &&
                      colIndex < currentPosition.x + currentTetromino.shape[0].length &&
                      currentTetromino.shape[rowIndex - currentPosition.y][
                        colIndex - currentPosition.x
                      ] === 1
                        ? { backgroundColor: currentTetromino.color }
                        : {}
                    }
                  />
                );
              })
            )}
          </div>

          {/* ゲームオーバー表示 */}
          {gameOver && (
            <div className="mt-4 text-center">
              <p className="text-red-500 text-2xl font-bold mb-4">GAME OVER</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                RESTART
              </button>
            </div>
          )}

          {/* 操作説明 */}
          <div className="mt-6 text-slate-400 text-sm space-y-1">
            <p className="font-semibold text-slate-300 mb-2">操作方法:</p>
            <p>← → : 移動</p>
            <p>↓ : ソフトドロップ</p>
            <p>↑ : 回転</p>
            <p>スペース : ハードドロップ</p>
          </div>
        </div>

        {/* サイドパネル */}
        <div className="space-y-6">
          {/* スコア */}
          <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">SCORE</h2>
            <p className="text-4xl font-bold text-blue-400">{score}</p>
          </div>

          {/* 次のブロック */}
          <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">NEXT</h2>
            <div
              className="bg-slate-950 rounded-lg p-4 flex items-center justify-center"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${nextTetromino.shape[0].length}, 1fr)`,
                gap: '4px',
                width: 'fit-content',
                margin: '0 auto',
              }}
            >
              {nextTetromino.shape.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-6 h-6 rounded-sm border ${
                      cell ? 'border-opacity-100' : 'border-slate-900'
                    }`}
                    style={
                      cell
                        ? {
                            backgroundColor: nextTetromino.color,
                            borderColor: nextTetromino.color,
                          }
                        : { backgroundColor: 'transparent' }
                    }
                  />
                ))
              )}
            </div>
          </div>

          {/* 一時停止ボタン */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
            disabled={gameOver}
          >
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
        </div>
      </div>
    </div>
  );
}
