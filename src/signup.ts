interface SignupUser {
    name: string;
    genre: string[];
    email: string;
    password: string;
}

const signupForm = document.getElementById("signupForm") as HTMLFormElement;

const nameInput = document.getElementById("name") as HTMLInputElement;

const genreSelect = document.getElementById("genre") as HTMLSelectElement;

const emailInput = document.getElementById("email") as HTMLInputElement;

const passwordInput = document.getElementById("password") as HTMLInputElement;

const confirmInput = document.getElementById("cnfpassword") as HTMLInputElement;

signupForm.addEventListener("submit", (event: SubmitEvent) => {

    event.preventDefault();

    const name: string = nameInput.value.trim();

    const genre: string[] = Array.from(genreSelect.selectedOptions).map(
        option => option.value
    );

    const email: string = emailInput.value.trim().toLowerCase();

    const password: string = passwordInput.value;

    const confirm: string = confirmInput.value;

if (password !== confirm) {
    alert("Passwords do not match!");
    return;
}

if (password.length<8){
    alert("Password should be atleast 8 characters")
}

const storedUsers = localStorage.getItem("users");

const users: SignupUser[] = storedUsers
    ? JSON.parse(storedUsers) as SignupUser[]
    : [];
const existingUser = users.find(user => user.email === email);

if (existingUser) {
    alert("The email is already Registered!");
    return;
}

const newUser: SignupUser = {
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