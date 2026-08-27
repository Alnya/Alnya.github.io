/**
 * OthelloAI.js
 * OthelloAction.py / OthelloActionNormal.py / OthelloActionWeak.py の JavaScript 移植版
 * 
 * 難易度:
 * - "strong": turn<50 で complete探索開始、48-49ターンでの早期complete判定あり
 * - "normal": turn<55 で complete探索開始
 * - "weak": complete探索なし
 */

const OthelloAI = (() => {
    const CORNERS = [
        [0, 0],
        [7, 0],
        [7, 7],
        [0, 7]
    ];

    const DANGERS = [
        [1, 0], [1, 1], [0, 1],    // corner [0,0] の隣接
        [1, 7], [0, 6], [1, 6],    // corner [0,7] の隣接
        [7, 6], [6, 6], [6, 7],    // corner [7,7] の隣接
        [6, 0], [7, 1], [6, 1]     // corner [7,0] の隣接
    ];

    const VECTORS = [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0],           [1, 0],
        [-1, 1],  [0, 1],  [1, 1]
    ];

    /**
     * リスト内に指定した座標が含まれるか
     */
    function containsMove(list, move) {
        for (let i = 0; i < list.length; i++) {
            if (list[i][0] === move[0] && list[i][1] === move[1]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 現在のターン数を計算する
     */
    function getTurn(board) {
        let turn = 61;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] === 0) turn--;
            }
        }
        return turn;
    }

    /**
     * メインのAI関数。難易度に応じて最善手を返す。
     * @param {number[][]} board - AI視点の盤面（AIが1, プレイヤーが-1）
     * @param {number[][]} moves - 合法手リスト
     * @param {string} difficulty - "strong" | "normal" | "weak"
     * @returns {number[]} 最善手 [x, y]
     */
    function getAction(board, moves, difficulty) {
        const turn = getTurn(board);

        // strong: 48-49ターンで合法手が1つの場合、早期にcomplete探索
        if (difficulty === "strong") {
            if (turn >= 48 && turn <= 49) {
                if (moves.length < 2) {
                    return completeMain(board, moves, turn);
                }
            }
        }

        // ターン2: 縦取り定石
        if (turn === 2) {
            const t2 = turn2(board);
            if (t2 !== null && containsMove(moves, t2)) {
                return t2;
            }
        }

        // ターン3: 兎定石
        if (turn === 3) {
            const t3 = turn3(board);
            if (t3 !== null && containsMove(moves, t3)) {
                return t3;
            }
        }

        // 序盤: 開放度重視
        if (turn < 15) {
            return openRateMain(board, moves);
        }

        // 難易度によって分岐
        if (difficulty === "weak") {
            // weakはcomplete探索なし、常にmiddle
            return middleMain(board, moves);
        } else if (difficulty === "normal") {
            // normalはturn<44はmiddle、44-54は安全チェック付きmiddle、55以降はcomplete
            if (turn < 44) {
                return middleMain(board, moves);
            } else if (turn < 55) {
                const move = middleMain(board, moves);
                if (containsMove(DANGERS, move)) {
                    return maxMove(board, moves);
                }
                return move;
            } else {
                return completeMain(board, moves, turn);
            }
        } else {
            // strong: turn<38はmiddle、38-45は安全チェック付きmiddle、46以降はcomplete
            if (turn < 38) {
                return middleMain(board, moves);
            } else if (turn < 46) {
                const move = middleMain(board, moves);
                if (containsMove(DANGERS, move)) {
                    return maxMove(board, moves);
                }
                return move;
            } else {
                return completeMain(board, moves, turn);
            }
        }
    }

    /**
     * complete探索のメインラッパー
     */
    function completeMain(board, moves, turn) {
        const [move, rate] = complete(board, moves, turn, 1);
        if (rate === 0) {
            return middleMain(board, moves);
        }
        return move;
    }

    /**
     * middle_checkのメインラッパー
     */
    function middleMain(board, moves) {
        const [move, _message] = middleCheck(board, moves);
        return move;
    }

    /**
     * open_rateのメインラッパー
     */
    function openRateMain(board, moves) {
        const [move, _rate] = openRate(board, moves);
        return move;
    }

    /**
     * 深さ優先探索 + minimax法
     */
    function complete(board, moves, turn, player) {
        const tmpBoard = OthelloLogic.deepCopy(board);

        if (moves.length === 0) {
            player *= -1;
            moves = OthelloLogic.getMoves(board, player);
        }
        if (moves.length === 0) {
            const rate = winRate(board);
            return [null, rate];
        }

        let ansMove = moves[0];

        if (turn === 60) {
            const nextBoard = OthelloLogic.execute(tmpBoard, ansMove, player);
            const rate = winRate(nextBoard);
            return [ansMove, rate];
        }

        let wRate = 0;
        let lRate = 1;

        for (let mi = 0; mi < moves.length; mi++) {
            const move = moves[mi];
            // 手動ディープコピー（高速化）
            for (let h = 0; h < 8; h++) {
                for (let w = 0; w < 8; w++) {
                    tmpBoard[h][w] = board[h][w];
                }
            }
            const nextBoard = OthelloLogic.execute(tmpBoard, move, player);
            const nextMoves = OthelloLogic.getMoves(nextBoard, player * -1);
            const [_nextMove, nextRate] = complete(nextBoard, nextMoves, turn + 1, player * -1);

            // ゲーム理論に基づく枝刈り
            if (player === 1 && nextRate === 1) {
                return [move, nextRate];
            } else if (player === -1 && nextRate === 0) {
                return [null, nextRate];
            }

            if (wRate < nextRate) {
                wRate = nextRate;
                ansMove = move;
            }
            if (lRate > nextRate) {
                lRate = nextRate;
            }
        }

        if (player === 1) {
            return [ansMove, wRate];
        } else {
            return [null, lRate];
        }
    }

    /**
     * 勝率を返す（1: AI勝ち, 0: AI負け）
     */
    function winRate(board) {
        let myStone = 0;
        let enemyStone = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] === 1) myStone++;
                else if (board[i][j] === -1) enemyStone++;
            }
        }
        return myStone > enemyStone ? 1 : 0;
    }

    /**
     * 開放度アルゴリズム
     */
    function openRate(board, moves) {
        const danger = [
            [1, 0], [1, 1], [0, 1],
            [1, 7], [0, 6], [1, 6],
            [7, 6], [6, 6], [6, 7],
            [6, 0], [7, 1], [6, 1]
        ];

        const listFirst = [
            [0, 0], [7, 0], [7, 7], [0, 7]
        ];

        // 角を取っている場合、その隣接マスは安全として扱う
        const delLs = [];
        for (let i = 0; i < 4; i++) {
            if (board[listFirst[i][0]][listFirst[i][1]] === 1) {
                delLs.push(i);
            }
        }
        for (let i = 0; i < delLs.length; i++) {
            for (let j = delLs[i] * 3; j < (delLs[i] * 3) + 3; j++) {
                listFirst.push(danger[j]);
            }
        }
        // dangerから安全なマスを削除（逆順）
        delLs.sort((a, b) => b - a);
        for (let i = 0; i < delLs.length; i++) {
            danger.splice(delLs[i] * 3, 3);
        }

        let ansMove = moves[0];
        let ansRate = 100;

        for (let mi = 0; mi < moves.length; mi++) {
            const move = moves[mi];
            if (containsMove(danger, move)) continue;
            if (containsMove(listFirst, move)) return [move, "great!"];

            let rate = 0;
            const zeroBoard = Array.from({ length: 8 }, () => Array(8).fill(0));
            const tmpBoard = OthelloLogic.deepCopy(board);
            const nextBoard = OthelloLogic.execute(tmpBoard, move, 1);

            for (let h = 0; h < 8; h++) {
                for (let w = 0; w < 8; w++) {
                    if (board[h][w] === -1 && nextBoard[h][w] === 1) {
                        for (let v = 0; v < VECTORS.length; v++) {
                            const movedIdx = [h + VECTORS[v][0], w + VECTORS[v][1]];
                            if (movedIdx[0] >= 0 && movedIdx[0] <= 7 && movedIdx[1] >= 0 && movedIdx[1] <= 7) {
                                zeroBoard[movedIdx[0]][movedIdx[1]] = 1;
                            }
                        }
                    }
                }
            }

            for (let h = 0; h < 8; h++) {
                for (let w = 0; w < 8; w++) {
                    if (board[h][w] === 0 && zeroBoard[h][w] === 1) {
                        rate++;
                    }
                }
            }

            if (rate < ansRate) {
                ansRate = rate;
                ansMove = move;
            }
        }

        if (ansRate === 100) {
            return openRateException(board, moves);
        }
        return [ansMove, ansRate];
    }

    /**
     * 全合法手が危険な場合のフォールバック
     */
    function openRateException(board, moves) {
        const danger = [[1, 1], [1, 6], [6, 1], [6, 6]];
        const listFirst = [[0, 0], [7, 0], [7, 7], [0, 7]];

        let ansMove = moves[0];
        let successFlag = 0;

        for (let mi = 0; mi < moves.length; mi++) {
            const move = moves[mi];
            if (containsMove(danger, move)) continue;

            const tmpBoard = OthelloLogic.deepCopy(board);
            const nextBoard = OthelloLogic.execute(tmpBoard, move, 1);
            const nextMoves = OthelloLogic.getMoves(nextBoard, -1);

            let nextFlag = 0;
            for (let nm = 0; nm < nextMoves.length; nm++) {
                if (containsMove(listFirst, nextMoves[nm])) {
                    nextFlag = 1;
                    break;
                }
            }
            if (nextFlag === 1) continue;

            ansMove = move;
            successFlag = 1;
        }

        const message = successFlag === 0 ? "open_rate_exception: failure..." : "open_rate_exception: success!";
        return [ansMove, message];
    }

    /**
     * 辺・角を意識したアルゴリズム
     */
    function middleCheck(board, moves) {
        const danger = [
            [1, 0], [1, 1], [0, 1],
            [1, 7], [0, 6], [1, 6],
            [7, 6], [6, 6], [6, 7],
            [6, 0], [7, 1], [6, 1]
        ];

        const leftLs = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]];
        const rightLs = [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7]];
        const upLs = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]];
        const downLs = [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]];

        const lsManager = [upLs, downLs, leftLs, rightLs];

        const listFirst = [[0, 0], [7, 0], [7, 7], [0, 7]];

        // 角を取っている場合の処理
        const delLs = [];
        for (let i = 0; i < 4; i++) {
            if (board[listFirst[i][0]][listFirst[i][1]] === 1) {
                delLs.push(i);
            }
        }
        try {
            for (let i = 0; i < delLs.length; i++) {
                for (let j = delLs[i] * 3; j < (delLs[i] * 3) + 3; j++) {
                    if (j < danger.length) {
                        listFirst.push(danger[j]);
                    }
                }
            }
        } catch (e) {
            // IndexError相当: 無視
        }
        delLs.sort((a, b) => b - a);
        for (let i = 0; i < delLs.length; i++) {
            danger.splice(delLs[i] * 3, 3);
        }

        for (let mi = 0; mi < moves.length; mi++) {
            const move = moves[mi];
            if (containsMove(danger, move)) continue;
            if (containsMove(listFirst, move)) return [move, "middle_check!"];

            for (let li = 0; li < lsManager.length; li++) {
                const ls = lsManager[li];
                if (containsMove(ls, move)) {
                    const tmpBoard = OthelloLogic.deepCopy(board);
                    const beforeExecute = forMiddleCheck(board, ls);
                    const nextBoard = OthelloLogic.execute(tmpBoard, move, 1);
                    const afterExecute = forMiddleCheck(nextBoard, ls);
                    const nextMoves = OthelloLogic.getMoves(nextBoard, -1);

                    if (beforeExecute + 1 < afterExecute) {
                        let flag = 0;
                        for (let nm = 0; nm < nextMoves.length; nm++) {
                            if (containsMove(ls, nextMoves[nm])) {
                                flag = 1;
                                break;
                            }
                        }
                        if (flag === 1) continue;
                        return [move, "middle_check!"];
                    } else if (beforeExecute + 1 === afterExecute) {
                        let enemyStone = 0;
                        for (let i = 0; i < ls.length; i++) {
                            if (board[ls[i][1]][ls[i][0]] === -1) {
                                enemyStone++;
                            }
                        }
                        if (enemyStone === 0) {
                            return [move, "middle_check!"];
                        }
                    }
                }
            }
        }

        // 良い場所に置けなかった場合、開放度アルゴリズムへ
        return openRate(board, moves);
    }

    /**
     * 辺上の自分の石の数を数える
     */
    function forMiddleCheck(board, ls) {
        let ans = 0;
        for (let i = 0; i < ls.length; i++) {
            ans += board[ls[i][1]][ls[i][0]];
        }
        return ans;
    }

    /**
     * 2ターン目定石（縦取り）
     */
    function turn2(board) {
        const t2b = [[4, 5], [5, 4], [3, 2], [2, 3]];
        const t2l = [[3, 5], [5, 3], [4, 2], [2, 4]];

        for (let i = 0; i < t2b.length; i++) {
            if (board[t2b[i][0]][t2b[i][1]] !== 0) {
                return t2l[i];
            }
        }
        return null;
    }

    /**
     * 3ターン目定石（兎定石）
     */
    function turn3(board) {
        const t3b = [[4, 5], [5, 4], [3, 2], [2, 3]];
        const t3l = [[2, 4], [4, 2], [5, 3], [3, 5]];

        for (let i = 0; i < t3b.length; i++) {
            if (board[t3b[i][0]][t3b[i][1]] !== 0) {
                return t3l[i];
            }
        }
        return null;
    }

    /**
     * 最も多く石を取れる手を返す
     */
    function maxMove(board, moves) {
        let ansMove = moves[0];
        let maxScore = getScore(OthelloLogic.execute(OthelloLogic.deepCopy(board), moves[0], 1));

        for (let mi = 0; mi < moves.length; mi++) {
            const move = moves[mi];
            const score = getScore(OthelloLogic.execute(OthelloLogic.deepCopy(board), move, 1));
            if (maxScore < score) {
                maxScore = score;
                ansMove = move;
            }
        }
        return ansMove;
    }

    /**
     * 自分の石の数を数える
     */
    function getScore(board) {
        let score = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] === 1) score++;
            }
        }
        return score;
    }

    return {
        getAction
    };
})();
