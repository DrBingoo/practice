const form = document.querySelector('form');
const errorMsg = document.getElementById('error');


form.addEventListener('submit', (element) => {
    element.preventDefault();

    errorMsg.textContent = '';

    let username = form.username.value;
    let password = form.password.value;

    fetch('/user/login', {
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(data => checkData(data))
    .catch(err => console.log(err));
});

function checkData(data){
    if (data.errors) {
        errorMsg.textContent = data.errors;
    }
    else if (data.user){
        location.href = '/';
    }
}