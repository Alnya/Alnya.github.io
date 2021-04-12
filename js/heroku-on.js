window.onload = function heroku_on() {
    let base_url = "https://othello-arena-api.herokuapp.com/get";
    fetch(base_url)
        .then(response => {
            console.log(response);
        }).catch(error => {
        console.log(error);
    });
}