
const signupForm = document.getElementById("signupForm")

signupForm.addEventListener("submit",function(event){
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const genreSelect = document.getElementById("genre")
    const genre = Array.from(genreSelect.selectedOptions).map(option => option.value)
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value
    const confirm =document.getElementById("cnfpassword").value

    if(password!== confirm){
        alert("Passwords do not match!")
        return;
    }


    const users = JSON.parse(localStorage.getItem("users")) || []

    const existingUser = users.find(user => user.email == email)
    if(existingUser){
        alert("The email is already Registered! ")
        return
    }



const newUser = {
    name:name,
    genre:genre,
    email:email,
    password:password
};

users.push(newUser)

localStorage.setItem("users",JSON.stringify(users))

alert("Account Created Succesfully")

window.location.href="signin.html"

});

