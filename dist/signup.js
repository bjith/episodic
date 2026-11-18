const signupForm = document.getElementById("signupForm");
const nameInput = document.getElementById("name");
const genreSelect = document.getElementById("genre");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("cnfpassword");
signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const genre = Array.from(genreSelect.selectedOptions).map(option => option.value);
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    if (password !== confirm) {
        alert("Passwords do not match!");
        return;
    }
    if (password.length < 8) {
        alert("Password should be atleast 8 characters");
    }
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers
        ? JSON.parse(storedUsers)
        : [];
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("The email is already Registered!");
        return;
    }
    const newUser = {
        name: name,
        genre: genre,
        email: email,
        password: password
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account Created Successfully");
    window.location.href = "signin.html";
});
export {};
//# sourceMappingURL=signup.js.map