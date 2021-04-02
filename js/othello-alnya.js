window.onload = function addTableChildren() {
    const table = document.getElementById("othello");
    for (let i = 0; i < 8; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let j = 0; j < 8; j++) {
            let td = document.createElement("td");
            // td.innerHTML = i + "," + j
            td.innerHTML = "<button class=\"btn btn-info\" onclick=al(3)>" + i + "," + j + "</button>";
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