let errorContainer = document.getElementById('errorContainerReg');
let regForm = document.getElementById('regForm');
let lastName = document.getElementById('userName');
let email = document.getElementById('email');
let password = document.getElementById('password');
let nameError = document.getElementById('nameError');
let EmailError = document.getElementById('EmailError');
let PasswordError = document.getElementById('PasswordError');
let error = false; 

if(errorContainer)
{
    errorContainer.style.display = "none";
    nameError.style.display = "none";
    EmailError.style.display = "none";
    PasswordError.style.display = "none";
}

if (regForm) {
    regForm.addEventListener('submit', (event) => {
        event.preventDefault();
        error = false;  
        errorContainer.style.display = "none";
        nameError.style.display = "none";
        EmailError.style.display = "none";
        PasswordError.style.display = "none";
        if(userName.value.trim().length<1)
        {
            error = true;
            userNameError.style.display = "block";
        }
        if(email.value.trim().length<1)
        {
            error = true;
            EmailError.style.display = "block";
        }   

        else{
            let emailLowercase = email.value.trim();
            if(!emailLowercase.toLowerCase().includes("@") && validateEmail(email.value.trim()))
            {
                error = true;
                EmailError.style.display = "block";
            }

        }


        if(password.value.trim().length<1)
        {
            error = true;
            PasswordError.style.display = "block";
        }

        if(error)
        {
            errorContainer.style.display = "block"
        }

        if(!error)
        {
            regForm.submit()

        }

    });

}

function validateEmail(elementValue){      
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue); 
} 
