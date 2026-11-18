
const signinForm = document.getElementById("signinForm");

signinForm.addEventListener("submit",function(event){
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const loggedInUser = users.find(user=>
        user.email == email && user.password == password
    );

    if(!loggedInUser){
        alert("Invalid email or Password")
        return
    }

    localStorage.setItem("currentUser",JSON.stringify({
        name:loggedInUser.name,
        genre:loggedInUser.genre,
        email:loggedInUser.email
    }))

    window.location.href="profile.html"




})