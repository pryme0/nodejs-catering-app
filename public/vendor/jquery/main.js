let alertbtn = document.getElementById('alerttext');
let alertprompt = document.getElementById('alert-promt');
const postUserData = (event) => {
    event.preventDefault();
    console.log('event fired')
    let fullname = document.forms["regform"]["fullname"].value;
    let email = document.forms["regform"]["email"].value;
    let address = document.forms["regform"]["address"].value;
    let password = document.forms["regform"]["password"].value;
    let password1 = document.forms["regform"]["password1"].value;
    console.log('submit button clicked')
    const userData = {
        fullname: fullname,
        email: email,
        address: address,
        password: password
    }
    if (fullname == '' || email == '' || address == ' ' || password == '' || password1 == '') { //checking to ensure null values are not submitted
        alertbtn.innerHTML = "Fields cannot be empty"
        return alertprompt.style.display = "block"
    } else {
        //use fetch api to send data to server
        fetch('/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then((res) => res.json())
            .then((data) => {
                alertbtn.innerHTML = data
                return alertprompt.style.display = "block"

            })
    }


}
let btn = document.getElementById('submit').addEventListener('click', postUserData);