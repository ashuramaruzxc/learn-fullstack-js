
document.getElementById("get-started").addEventListener("click", validate)

function validate() {
    let out = document.getElementById("out");
    let firstName = document.getElementById("first-name").value.trim();
    let lastName = document.getElementById("last-name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();


    console.log(email);
    let errArr = []

    if (firstName.length === 0) {
        out.innerText = "dont enter first name";
        return
    } else if(firstName.includes(' ')){
        out.innerText = "first name must not contain spaces";
    }


    if (lastName.length === 0) {
        out.innerText = "dont enter last name";
        return
    } else if(lastName.includes(' ')){
        out.innerText = "last name must not contain spaces";
        return;
    }


    if (email.length === 0) {
        out.innerText = "dont enter email";
        return;
    } else if(email.includes(' ')){
        out.innerText = "email must not contain spaces";
        return;
    } else if(!email.endsWith(`@gmail.com`)){
        out.innerText = "email must be registered on gmail.com";
        return;
    }

    if (password.length === 0) {
        out.innerText = "dont enter password";
        return
    } else if(lastName.includes(' ')){
        out.innerText = "last name must not contain spaces";
        return;
    } else if(password.length < 6){
        out.innerText = "the password must be more than 6 characters";
        return;
    } else if(!password.match(/[0-9]/)){
        out.innerText = "the password must contain numeric characters";
        return;
    }  else if(!password.match(/[A-Za-z]/)){
        out.innerText = "the password must contain characters";
        return;
    }

    out.innerText = "its ok"
}

