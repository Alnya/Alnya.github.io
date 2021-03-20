function add_number(n) {
    let num = document.getElementById("num");
    const str_len = num.textContent.length;
    if (7 <= str_len) {
        no_longer_disable()
        return null;
    }
    disable();
    const number = parseInt(num.textContent);
    if (number === 0) {
        if (n !== 0) {
            num.innerHTML = n;
            draw_prime();
        }
    } else {
        num.innerHTML = num.textContent + n;
        draw_prime();
    }
    disable();
    if (str_len === 6) {
        no_longer_disable()
    }
}

function ac() {
    let num = document.getElementById("num");
    num.innerHTML = "0";
    let prime = document.getElementById("prime");
    prime.innerHTML = "";
    ac_disable();
}

function draw_prime() {
    const n = parseInt(document.getElementById("num").textContent);
    let prime = document.getElementById("prime");
    if (is_prime(n)) {
        prime.style.color = "red";
        prime.innerHTML = "PRIME!";
    } else {
        prime.style.color = "blue";
        prime.innerHTML = "NOT PRIME...";
    }
}

function is_prime(n) {
    let sieve = new Array(n);
    let max = Math.floor(Math.sqrt(n));
    sieve[0] = false;
    sieve[1] = false;
    sieve[2] = true;
    for (let i = 3; i <= n; i++) {
        sieve[i] = i % 2 !== 0;
    }
    for (let i = 3; i <= max; i++) {
        if (sieve[i] === true) {
            for (let j = i * i; j <= n; j += i) {
                sieve[j] = false;
            }
        }
    }
    return sieve[n];
}

function disable() {
    for (let i = 0; i <= 9; i++) {
        let num = document.getElementById(String(i));
        let frag = num.disabled;
        num.disabled = !frag;
    }
}

function no_longer_disable() {
    for (let i = 0; i <= 9; i++) {
        let num = document.getElementById(String(i));
        num.disabled = true;
    }
}

function ac_disable() {
    for (let i = 0; i <= 9; i++) {
        let num = document.getElementById(String(i));
        num.disabled = false;
    }
}