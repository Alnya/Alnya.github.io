function turn_button(is_first) {
    if (is_first) {
        add_table_children(is_first);
    } else {
        add_table_children(is_first);
    }
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
            td.innerHTML = `<button id=${id} class="btn btn-info" onclick=execute(${id}) style='font-size: 40px' disabled=true>` + 0 + "</button>";
            if (i === 3 && j === 3 || i === 4 && j === 4) {
                td.innerHTML = `<button id=${id} class="btn btn-info" onclick=execute(${id}) style='font-size: 40px' disabled=true>` + -1 + "</button>";
            }
            if (i === 3 && j === 4 || i === 4 && j === 3) {
                td.innerHTML = `<button id=${id} class="btn btn-info" onclick=execute(${id}) style='font-size: 40px' disabled=true>` + 1 + "</button>";
            }
            table.appendChild(td);
        }
    }
    if (is_first) {
        get_moves(create_form_data());
    } else {
        post();
    }
    // get_moves(create_form_data());
    color_ac();
    show_scores();
}

function update_board(data) {
    let board = data['board'];
    board = board.toString();
    board = board.split(",");
    console.log("success!")
    for (let i = 0; i < board.length; i++) {
        let button = document.getElementById(`${i}`);
        button.innerHTML = board[i];
    }
    color_ac();
    show_scores();
}

function post() {
    let base_url = "https://othello-arena-api.herokuapp.com/post_middle";
    let formData = create_form_data();
    fetch(base_url, {mode: "cors", method: 'POST', body: formData})
        .then(response => {
            let promise = response.json();
            promise.then((data) => {
                update_board(data);
                formData = create_form_data();
                if (data['action'].length === 0) {
                    get_moves(formData, true);
                } else {
                    get_moves(formData);
                }
                show_scores();
            });
        }).catch(error => {
        console.log(error);
    });
}

function execute(id) {
    button_disabled();
    color_change_to_black(id);
    let base_url = "https://othello-arena-api.herokuapp.com/player_execute";
    let formData = create_form_data();
    formData.append('action', id)
    fetch(base_url, {mode: "cors", method: 'POST', body: formData})
        .then(response => {
            let promise = response.json();
            promise.then((data) => {
                update_board(data);
                post();
                show_scores();
            });
        }).catch(error => {
        console.log(error);
    });
}


function create_form_data() {
    let formData = new FormData();
    let num = "";
    for (let i = 0; i < 64; i++) {
        let button = document.getElementById(`${i}`);
        num += button.innerHTML;
    }
    formData.append('num', num);
    return formData;
}

function get_moves(formData, frag = false) {
    let base_url = "https://othello-arena-api.herokuapp.com/get_moves";
    fetch(base_url, {mode: "cors", method: 'POST', body: formData})
        .then(response => {
            let promise = response.json();
            promise.then((data) => {
                let moves = data['moves'];
                console.log(moves);
                if (frag && moves.length === 0) {
                    game_over();
                } else if (moves.length === 0) {
                    post();
                }
                button_disabled();
                for (let i = 0; i < moves.length; i++) {
                    let id = parseInt(moves[i][0] + parseInt(moves[i][1]) * 8);
                    color_change(id);
                }
            });
        }).catch(error => {
        console.log(error);
    });
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
    let color = "black";
    button.style.backgroundColor = color;
    button.style.color = color;
    button.disabled = true;
}

function color_ac() {
    for (let i = 0; i < 64; i++) {
        let button = document.getElementById(`${i}`);
        let color = "green";
        button.style.backgroundColor = color;
        if (button.innerHTML === "1") {
            color = "black";
            button.style.backgroundImage = "url('https://alnya.github.io/othello-alnya/images/black-stone.jpg')";
        } else if (button.innerHTML === "-1") {
            color = "white";
            button.style.backgroundImage = "url('https://alnya.github.io/othello-alnya/images/white-stone.jpg')";
        }
        // button.style.backgroundColor = color;
        button.style.color = color;
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