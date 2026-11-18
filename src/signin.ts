interface User {
    name: string;
    genre: string[];
    email: string;
    password: string;
}

const signinForm = document.getElementById("signinForm") as HTMLFormElement;

const emailInput = document.getElementById("email") as HTMLInputElement;

const passwordInput = document.getElementById("password") as HTMLInputElement;

signinForm.addEventListener("submit", (event: SubmitEvent) => {

    event.preventDefault();

    const email: string = emailInput.value.trim().toLowerCase();

    const password: string = passwordInput.value;

    const storedUsers = localStorage.getItem("users");

    const users: User[] = storedUsers
    ? JSON.parse(storedUsers) as User[]
    : [];

    const loggedInUser = users.find(user =>
    user.email === email && user.password === password);

    if (!loggedInUser) {
    alert("Invalid email or Password");
    return;
    }

    localStorage.setItem("currentUser", JSON.stringify({
    name: loggedInUser.name,
    genre: loggedInUser.genre,
    email: loggedInUser.email
}));

    window.location.href = "profile.html"

});