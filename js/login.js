//Fields
const nameField = document.getElementById('first-name');
const lastNameField = document.getElementById('last-name');
const codeField = document.getElementById('code');
const emailField = document.getElementById('email');

//Message
const errorMessage = document.getElementById('error-message');

//Button
document.getElementById('login-button').addEventListener('click', LogIn);

let user = {};

function LogIn()
{
    user.name = nameField.value;
    user.lastName = lastNameField.value;
    user.code = parseInt(codeField.value);
    user.email = emailField.value;

    // console.log(user);

    if(user.name != '' && user.lastName != '' && user.code != NaN && user.email != '')
    {
        errorMessage.innerHTML = '';

        fetch('https://tlsvocacional.renzoguido.com/api/check/student',
        {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then((response) => response.json())
        .then((result) =>
        {
            if(result.code == 1)
            {
                GetSurvey();
            }
            else
            {
                errorMessage.innerHTML = 'Survey Already Completed';
            }
        });
    }
    else
    {
        errorMessage.innerHTML = 'Incomplete Fields';
    }
}