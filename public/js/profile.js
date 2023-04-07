function getUserInfo() {
    fetch('/user/info')
    .then(res => res.json())
    .then(info => displayInfo(info))
    .catch(err => console.log(err))
}

function displayInfo(info){
    if (info.redirect){
        location.href = info.redirect;
    }
    else{
        let container = document.getElementById('user-info');
        let content = `<form>
            <h2>Username</h2>
            <input type = 'text' name = 'username' required value = ${info[0].username}>
            <h2>Password</h2>
            <input type = 'password' name = 'password' required value = ${info[0].password} >
            <h2>First Name</h2>
            <input type = 'text' name = 'first_name' required value = ${info[0].first_name}>
            <h2>Last Name</h2>
            <input type = 'text' name = 'last_name' required value = ${info[0].last_name}>
            <h2>Gender</h2>
            <label style = 'color  : white'>Male
                <input id = 'Male' value = 'Male' name = 'gender' type = 'radio' required>
            </label>
            <label style = 'color : white'>Female
                <input id = 'Female' value = 'Female' name = 'gender' type = 'radio' required>
            </label>
            <h2>Address</h2>
            <input type = 'text' name = 'address' required value = ${info[0].address}>
            <h2>Mobile number</h2>
            <input type = 'number' name = 'mobile_number' required value = ${info[0].mobile_number}>
            <h2>Email Address</h2>
            <input type = 'email' name = 'email' required value = ${info[0].email_address} >
            <button id = 'update' style = 'display:block;background-color:green'>Update your info</button>
        </form>`

        container.insertAdjacentHTML('afterbegin', content);

        document.getElementById(`${info[0].gender}`).checked = true;

        formListener();
    }
}

document.getElementById('delete').addEventListener('click', () => {
    let confirmation = confirm('Are you sure you want to remove your account.');
    if (confirmation === true){
        fetch('/user/profile', {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(msg => {
            if (msg.user){
                location.href = '/';
            }
            else if (msg.redirect) {
                location.href = msg.redirect;
            }
        })
        .catch(err => console.log(err))

    }
})

function formListener(){
    const form = document.querySelector('form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let username = form.username.value; 
        let password = form.password.value;
        let first_name = form.first_name.value;
        let last_name = form.last_name.value;
        let gender = form.gender.value;
        let address = form.address.value;
        let number = form.mobile_number.value;
        let email = form.email.value;

        fetch('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({username, password, first_name, last_name, gender, address, number, email}),
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(msg => {
            if (msg.redirect){
                location.href = msg.redirect;
            }
            else if (msg.user){
                location.reload();
            }
        })
        .catch(err => console.log(err))
    })
}

