const signinForm = document.getElementById("signinForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
signinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers
        ? JSON.parse(storedUsers)
        : [];
    const loggedInUser = users.find(user => user.email === email && user.password === password);
    if (!loggedInUser) {
        alert("Invalid email or Password");
        return;
    }
    localStorage.setItem("currentUser", JSON.stringify({
        name: loggedInUser.name,
        genre: loggedInUser.genre,
        email: loggedInUser.email
    }));
    window.location.href = "profile.html";
});
export {};
//# sourceMappingURL=signin.js.map