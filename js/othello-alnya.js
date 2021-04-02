window.onload = function addTableChildren() {
    const table = document.getElementById("othello");
    for (let i = 0; i < 8; i++){
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let j = 0; j < 8; j++){
            let td = document.createElement("td");
            td.innerHTML = i + "," + j
            table.appendChild(td);
        }
    }
}