window.onload = function addTableChildren() {
    const table = document.getElementById("othello");
    for (let i = 0; i < 8; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let j = 0; j < 8; j++) {
            let td = document.createElement("td");
            // td.innerHTML = i + "," + j
            // td.innerHTML = "<button id=`${i}` class=\"btn btn-info\" onclick=get() style='font-size: 40px'>" + i + "," + j + "</button>";
            let id = i * 8 + j;
            td.innerHTML = `<button id=${id} class=\"btn btn-info\" onclick=post(${id}) style='font-size: 40px'>` + 0 + "</button>";
            if (i === 3 && j === 3 || i === 4 && j === 4) {
                td.innerHTML = `<button id=${id} class=\"btn btn-info\" onclick=post(${id}) style='font-size: 40px'>` + -1 + "</button>";
            }
            if (i === 3 && j === 4 || i === 4 && j === 3) {
                td.innerHTML = `<button id=${id} class=\"btn btn-info\" onclick=post(${id}) style='font-size: 40px'>` + 1 + "</button>";
            }
            // let a = "a";
            // let b = `${a}`
            // let c = "${}"
            // if (i === 3) {
            //     td.style.backgroundColor = "red";
            //     td.innerHTML = "<button class=\"btn btn-info\" style='background-color: red'>" + i + "," + j + "</button>";
            // }
            table.appendChild(td);
        }
    }
}

function al(i) {
    alert(i);
}

function get(id) {
    let base_url = "https://othello-arena-api.herokuapp.com/get";
    fetch(base_url, {mode: "cors"})
        .then(response => {
            let promise = response.text();
            promise.then((data) => {
                let td = document.getElementById(id);
                alert(td.innerHTML);
                td.innerHTML = data;
            });
        }).catch(error => {
        alert(4);
        alert(error);
    });
}

function post(id) {
    let base_url = "https://othello-arena-api.herokuapp.com/post";
    let formData = new FormData();
    let num = "";
    for (let i = 0; i < 64; i++) {
        let td = document.getElementById(`${i}`);
        num += td.innerHTML;
    }
    formData.append('num', num);
    fetch(base_url, {mode: "cors", method: 'POST', body: formData})
        .then(response => {
            let promise = response.json();
            promise.then((data) => {
                let board = data['board'];
                board = board.toString();
                board = board.split(",");
                console.log("success!")
                for (let i = 0; i < board.length; i++) {
                    let td = document.getElementById(`${i}`);
                    td.innerHTML = board[i];
                }
                // let td = document.getElementById(id);
                // alert(data['board']);
                // alert(typeof data['board']);
                // td.innerHTML = data;
            });
        }).catch(error => {
        console.log(error);
    });
}