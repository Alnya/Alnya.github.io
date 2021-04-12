window.onload = function img_position_set(){
    for (let i = 0; i < 10; i++){
        let img = document.getElementById(`${i}`);
        img.style.top = "20px";
        img.style.left = "20px";
    }
}