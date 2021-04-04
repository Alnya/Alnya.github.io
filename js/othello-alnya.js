window.onload = function addTableChildren() {
    const table = document.getElementById("othello");
    for (let i = 0; i < 8; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let j = 0; j < 8; j++) {
            let td = document.createElement("td");
            let id = i * 8 + j;
            td.innerHTML = `<button id=${id} class="btn btn-info" onclick=post(${id}) style='font-size: 40px'>` + 0 + "</button>";
            if (i === 3 && j === 3 || i === 4 && j === 4) {
                td.innerHTML = `<button id=${id} class="btn btn-info" onclick=post(${id}) style='font-size: 40px'>` + -1 + "</button>";
            }
            if (i === 3 && j === 4 || i === 4 && j === 3) {
                td.innerHTML = `<button id=${id} class="btn btn-info" onclick=post(${id}) style='font-size: 40px'>` + 1 + "</button>";
            }
            // if (i === 3) {
            //     td.style.backgroundColor = "red";
            //     td.innerHTML = "<button class=\"btn btn-info\" style='background-color: red'>" + i + "," + j + "</button>";
            // }
            table.appendChild(td);
        }
    }
    color_ac();
}

// function al(i) {
//     alert(i);
// }
//
// function get(id) {
//     let base_url = "https://othello-arena-api.herokuapp.com/get";
//     fetch(base_url, {mode: "cors"})
//         .then(response => {
//             let promise = response.text();
//             promise.then((data) => {
//                 let td = document.getElementById(id);
//                 alert(td.innerHTML);
//                 td.innerHTML = data;
//             });
//         }).catch(error => {
//         alert(4);
//         alert(error);
//     });
// }

function post(id) {
    let base_url = "https://othello-arena-api.herokuapp.com/post";
    // let formData = new FormData();
    // let num = "";
    // for (let i = 0; i < 64; i++) {
    //     let button = document.getElementById(`${i}`);
    //     num += button.innerHTML;
    // }
    // formData.append('num', num);
    // get_moves(formData);
    let formData = create_form_data();
    fetch(base_url, {mode: "cors", method: 'POST', body: formData})
        .then(response => {
            let promise = response.json();
            promise.then((data) => {
                let board = data['board'];
                let action = data['action'];
                board = board.toString();
                board = board.split(",");
                console.log("success!")
                for (let i = 0; i < board.length; i++) {
                    let button = document.getElementById(`${i}`);
                    button.innerHTML = board[i];
                }
                color_ac();
                // color_change(parseInt(action[0]) + parseInt(action[1]) * 8);
                formData = create_form_data();
                get_moves(formData);
            });
        }).catch(error => {
        console.log(error);
    });
}


function create_form_data(){
    let formData = new FormData();
    let num = "";
    for (let i = 0; i < 64; i++) {
        let button = document.getElementById(`${i}`);
        num += button.innerHTML;
    }
    formData.append('num', num);
    return formData;
}

function get_moves(formData){
    let base_url = "https://othello-arena-api.herokuapp.com/get_moves";
    fetch(base_url, {mode: "cors", method: 'POST', body: formData})
        .then(response => {
            let promise = response.json();
            promise.then((data) => {
                let moves = data['moves'];
                console.log(moves);
                button_disabled();
                for (let i = 0; i < moves.length; i++){
                    let id = parseInt(moves[i][0] + parseInt(moves[i][1]) * 8);
                    color_change(id);
                }
                // board = board.toString();
                // board = board.split(",");
                // console.log("success!")
                // for (let i = 0; i < board.length; i++) {
                //     let button = document.getElementById(`${i}`);
                //     button.innerHTML = board[i];
                // }
            });
        }).catch(error => {
        console.log(error);
    });
}

function color_change(id){
    let button = document.getElementById(id);
    let color = "#FFFD88";
    button.style.backgroundColor = color;
    button.style.color = color;
    button.disabled = false;
}

function button_disabled(){
    for (let i = 0; i < 64; i++){
        let button = document.getElementById(`${i}`);
        button.disabled = true;
    }
}

function color_ac(){
    for(let i = 0; i < 64; i++){
        let button = document.getElementById(`${i}`);
        let color = "green";
        if (button.innerHTML === "1"){
            color = "black";
        } else if (button.innerHTML === "-1"){
            color = "white"
        }
        button.style.backgroundColor = color;
        button.style.color = color;
    }
}