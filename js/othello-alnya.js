window.onload = function add_table_children() {
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
            // if (i === 3) {
            //     td.style.backgroundColor = "red";
            //     td.innerHTML = "<button class=\"btn btn-info\" style='background-color: red'>" + i + "," + j + "</button>";
            // }
            table.appendChild(td);
        }
    }
    get_moves(create_form_data());
    color_ac();
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
}

function post() {
    let base_url = "https://othello-arena-api.herokuapp.com/post";
    let formData = create_form_data();
    fetch(base_url, {mode: "cors", method: 'POST', body: formData})
        .then(response => {
            let promise = response.json();
            promise.then((data) => {
                update_board(data);
                formData = create_form_data();
                get_moves(formData);
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

function get_moves(formData) {
    // let check_url = "https://othello-arena-api.herokuapp.com/check";
    // fetch(check_url, {mode: "cors", method: 'POST', body: formData})
    //     .then(response => {
    //         let promise = response.text();
    //         promise.then((data) => {
    //             if(data === "1"){
    //                 alert(1);
    //                 game_over()
    //             } else {
    //                 alert(2);
    //             }
    //         });
    //     }).catch(error => {
    //     console.log(error);
    // });
    let base_url = "https://othello-arena-api.herokuapp.com/get_moves";
    fetch(base_url, {mode: "cors", method: 'POST', body: formData})
        .then(response => {
            let promise = response.json();
            promise.then((data) => {
                let moves = data['moves'];
                console.log(moves);
                if (moves.length === 0) {
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
        if (button.innerHTML === "1") {
            color = "black";
        } else if (button.innerHTML === "-1") {
            color = "white"
        }
        button.style.backgroundColor = color;
        button.style.color = color;
    }
}

function game_over() {
    for (let i = 0; i < 64; i++) {
        let button = document.getElementById(`${i}`);
        let color = "red";
        button.style.backgroundColor = color;
        button.style.color = color;
    }
}