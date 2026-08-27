/**
 * OthelloLogic.js
 * OthelloLogic.py の JavaScript 移植版
 */

const OthelloLogic = (() => {
    const SIZE = 8;
    const DIRS = [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0],           [1, 0],
        [-1, 1],  [0, 1],  [1, 1]
    ];

    /**
     * 盤面をディープコピーする
     */
    function deepCopy(board) {
        return board.map(row => row.slice());
    }

    /**
     * 指定した手を実行し、石をひっくり返した後の盤面を返す
     * @param {number[][]} board - 盤面 (8x8)
     * @param {number[]} action - [x, y] 座標
     * @param {number} player - 1 or -1
     * @returns {number[][]} 実行後の盤面
     */
    function execute(board, action, player) {
        board[action[1]][action[0]] = player;
        for (let d = 0; d < DIRS.length; d++) {
            const dir = DIRS[d];
            const result = executeFlip(board, player, action[1], action[0], dir);
            if (result.success) {
                for (let i = 0; i < result.flips.length; i++) {
                    board[result.flips[i][0]][result.flips[i][1]] = player;
                }
            }
        }
        return board;
    }

    /**
     * 一方向のひっくり返しを判定
     */
    function executeFlip(b, p, x, y, dir) {
        if (x + dir[0] < 0 || x + dir[0] >= SIZE || y + dir[1] < 0 || y + dir[1] >= SIZE) {
            return { success: false, flips: null };
        }

        if (b[x + dir[0]][y + dir[1]] === (p * -1)) {
            const flips = [];
            flips.push([x + dir[0], y + dir[1]]);
            const incDir = [dir[0], dir[1]];
            incDir[0] += dir[0];
            incDir[1] += dir[1];
            while (true) {
                if (x + incDir[0] < 0 || x + incDir[0] >= SIZE || y + incDir[1] < 0 || y + incDir[1] >= SIZE) {
                    return { success: false, flips: null };
                }
                if (b[x + incDir[0]][y + incDir[1]] === p) {
                    return { success: true, flips: flips };
                } else if (b[x + incDir[0]][y + incDir[1]] === 0) {
                    return { success: false, flips: null };
                }
                flips.push([x + incDir[0], y + incDir[1]]);
                incDir[0] += dir[0];
                incDir[1] += dir[1];
            }
        }

        return { success: false, flips: null };
    }

    /**
     * 合法手を取得する
     * @param {number[][]} board - 盤面 (8x8)
     * @param {number} player - 1 or -1
     * @returns {number[][]} 合法手のリスト [[x,y], ...]
     */
    function getMoves(board, player) {
        const moves = [];
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                if (board[x][y] === (player * -1)) {
                    for (let d = 0; d < DIRS.length; d++) {
                        const dir = DIRS[d];
                        const result = search(player, board, x, y, dir);
                        if (result.success) {
                            // 重複チェック
                            let duplicate = false;
                            for (let m = 0; m < moves.length; m++) {
                                if (moves[m][0] === result.move[0] && moves[m][1] === result.move[1]) {
                                    duplicate = true;
                                    break;
                                }
                            }
                            if (!duplicate) {
                                moves.push(result.move);
                            }
                        }
                    }
                }
            }
        }
        return moves;
    }

    /**
     * 合法手を探索する
     */
    function search(p, b, x, y, dir) {
        if (x + dir[0] < 0 || x + dir[0] >= SIZE || y + dir[1] < 0 || y + dir[1] >= SIZE) {
            return { success: false, move: null };
        }

        if (b[x + dir[0]][y + dir[1]] === 0) {
            const reverseDir = [dir[0] * -1, dir[1] * -1];
            while (true) {
                if (x + reverseDir[0] < 0 || x + reverseDir[0] >= SIZE || y + reverseDir[1] < 0 || y + reverseDir[1] >= SIZE) {
                    return { success: false, move: null };
                }
                if (b[x + reverseDir[0]][y + reverseDir[1]] === p) {
                    return { success: true, move: [y + dir[1], x + dir[0]] };
                } else if (b[x + reverseDir[0]][y + reverseDir[1]] === 0) {
                    return { success: false, move: null };
                }
                reverseDir[0] += dir[0] * -1;
                reverseDir[1] += dir[1] * -1;
            }
        }

        return { success: false, move: null };
    }

    /**
     * 盤面の石の色を反転する（AI視点の盤面に変換）
     * @param {number[][]} board - 盤面 (8x8)
     * @returns {number[][]} 反転後の盤面
     */
    function getReverseboard(board) {
        for (let x = 0; x < SIZE; x++) {
            for (let y = 0; y < SIZE; y++) {
                board[x][y] = board[x][y] * -1;
            }
        }
        return board;
    }

    return {
        execute,
        getMoves,
        getReverseboard,
        deepCopy,
        SIZE
    };
})();
