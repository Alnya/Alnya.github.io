/**
 * othello-alnya-hard.js
 * 難易度: ハード (strong)
 * Heroku API通信を排除し、ローカルのAIロジックで動作する版
 */

const DIFFICULTY = "strong";

function turn_button(is_first) {
    add_table_children(is_first);
    let scores = document.getElementById("scores");
    scores.style.visibility = "visible";
    let turn_buttons = document.getElementById("turn");
    turn_buttons.style.display = "none";
}

function add_table_children(is_first) {
    const table = document.getElementById("othello");
    for (let i = 0; i < 8; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let j = 0; j < 8; j++) {
            let td = document.createElement("td");
            let id = i * 8 + j;
            td.innerHTML = `<button id=${id} class="btn btn-info" onclick=execute(${id}) style='font-size: 0' disabled=true>` + 0 + "</button>";
            if (i === 3 && j === 3 || i === 4 && j === 4) {
                td.innerHTML = `<button id=${id} class="btn btn-info" onclick=execute(${id}) style='font-size: 0' disabled=true>` + -1 + "</button>";
            }
            if (i === 3 && j === 4 || i === 4 && j === 3) {
                td.innerHTML = `<button id=${id} class="btn btn-info" onclick=execute(${id}) style='font-size: 0' disabled=true>` + 1 + "</button>";
            }
            table.appendChild(td);
        }
    }
    if (is_first) {
        get_moves(false);
    } else {
        post();
    }
    color_ac();
    show_scores();
}

/**
 * ボタンのinnerHTMLから盤面文字列を生成する
 */
function getBoardString() {
    let num = "";
    for (let i = 0; i < 64; i++) {
        let button = document.getElementById(`${i}`);
        num += button.innerHTML;
    }
    return num;
}

/**
 * 盤面文字列を2次元配列に変換する (app.py の posted_board 相当)
 */
function parseBoardString(num) {
    const ls = [];
    let i = 0;
    while (i < num.length) {
        if (num[i] === "-") {
            ls.push(-1);
            i += 2; // "-1" をスキップ
        } else {
            ls.push(parseInt(num[i]));
            i++;
        }
    }
    if (ls.length !== 64) return null;
    const board = [];
    for (let r = 0; r < 8; r++) {
        board.push([]);
        for (let c = 0; c < 8; c++) {
            board[r].push(ls[r * 8 + c]);
        }
    }
    return board;
}

/**
 * 2次元盤面を1次元配列に変換してUIを更新する
 */
function update_board(board) {
    const flat = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            flat.push(board[i][j].toString());
        }
    }
    for (let i = 0; i < flat.length; i++) {
        let button = document.getElementById(`${i}`);
        if (button.innerHTML !== flat[i]) {
            button.style.backgroundColor = "pink";
        }
        button.innerHTML = flat[i];
    }
    color_ac();
    show_scores();
}

/**
 * AIの手を実行する（旧 /post エンドポイント相当）
 */
function post() {
    // UIの応答性のためsetTimeoutで非同期化
    setTimeout(() => {
        const num = getBoardString();
        let board = parseBoardString(num);
        if (!board) return;

        // AI視点に変換（盤面を反転）
        const reversedBoard = OthelloLogic.getReverseboard(OthelloLogic.deepCopy(board));
        const moves = OthelloLogic.getMoves(reversedBoard, 1);

        if (moves.length === 0) {
            // AIがパスの場合
            update_board(board);
            get_moves(true);
            show_scores();
            return;
        }

        const action = OthelloAI.getAction(
            OthelloLogic.getReverseboard(OthelloLogic.deepCopy(board)),
            moves,
            DIFFICULTY
        );
        board = OthelloLogic.execute(OthelloLogic.deepCopy(board), action, -1);

        update_board(board);
        get_moves(false);
        show_scores();
    }, 50);
}

/**
 * プレイヤーの手を実行する（旧 /player_execute エンドポイント相当）
 */
function execute(id) {
    button_disabled();
    color_change_to_black(id);

    const num = getBoardString();
    let board = parseBoardString(num);
    if (!board) return;

    const action = [id % 8, Math.floor(id / 8)];
    board = OthelloLogic.execute(OthelloLogic.deepCopy(board), action, 1);

    update_board(board);
    post();
    show_scores();
}

/**
 * プレイヤーの合法手を取得してUIに反映する（旧 /get_moves エンドポイント相当）
 */
function get_moves(afterAiPass) {
    const num = getBoardString();
    const board = parseBoardString(num);
    if (!board) return;

    const moves = OthelloLogic.getMoves(OthelloLogic.deepCopy(board), 1);
    console.log(moves);

    if (afterAiPass && moves.length === 0) {
        game_over();
        return;
    } else if (moves.length === 0) {
        // プレイヤーがパスの場合、AIの手番へ
        post();
        return;
    }

    button_disabled();
    for (let i = 0; i < moves.length; i++) {
        let id = moves[i][0] + moves[i][1] * 8;
        color_change(id);
    }
}

function color_change(id) {
    let button = document.getElementById(id);
    let color = "#FFFD88";
    button.style.backgroundColor = color;
    button.style.color = color;
    button.disabled = false;
}

function button_disabled() {
    for (let i = 0; i < 64; i++) {
        let button = document.getElementById(`${i}`);
        button.disabled = true;
    }
}

function color_change_to_black(id) {
    let button = document.getElementById(id);
    button.style.backgroundColor = "pink";
    button.style.backgroundImage = "url('https://alnya.github.io/othello-alnya/images/black-stone.png')";
    button.disabled = true;
}

function color_ac() {
    for (let i = 0; i < 64; i++) {
        let button = document.getElementById(`${i}`);
        button.style.backgroundColor = "green";
        if (button.innerHTML === "1") {
            button.style.backgroundImage = "url('https://alnya.github.io/othello-alnya/images/black-stone.png')";
        } else if (button.innerHTML === "-1") {
            button.style.backgroundImage = "url('https://alnya.github.io/othello-alnya/images/white-stone.png')";
        }
    }
}

function game_over() {
    let player = document.getElementById("player");
    let alnya = document.getElementById("alnya");
    let player_score = parseInt(player.innerHTML);
    let alnya_score = parseInt(alnya.innerHTML);
    let winner = document.getElementById("winner");
    if (player_score > alnya_score) {
        winner.innerHTML = "Player Win!";
        winner.style.color = "red";
    } else if (player_score < alnya_score) {
        winner.innerHTML = "Player Lose...";
        winner.style.color = "blue";
    } else {
        winner.innerHTML = "Draw";
        winner.style.color = "green";
    }
}

function show_scores() {
    let player_score = 0;
    let alnya_score = 0;
    for (let i = 0; i < 64; i++) {
        let button = document.getElementById(`${i}`);
        let score = button.innerHTML;
        if (score === "1") {
            player_score += 1;
        } else if (score === "-1") {
            alnya_score += 1;
        }
    }
    let player = document.getElementById("player");
    let alnya = document.getElementById("alnya");
    player.innerHTML = `${player_score}`;
    alnya.innerHTML = `${alnya_score}`;
}
