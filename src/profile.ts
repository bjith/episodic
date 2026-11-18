interface CurrentUser {
    name: string;
    genre: string[];
    email: string;
}

interface SavedSeries {
    id: number;
    name: string;
    image: string;
    rating: number | null;
    genres: string[];
    status?: "pending" | "completed";
}

type WatchlistTab = "pending" | "completed";

const currentUser: CurrentUser | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
);

const proclr = document.getElementById("prof") as HTMLDivElement | null;

if (proclr) {
    proclr.style.color = "white";
}

if (!currentUser) {

    window.location.href = "signin.html";

} else {

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const favgenre = document.getElementById("favgenre");
    const profileGenre = document.getElementById("profileGenre");

    if (profileName) {
        profileName.textContent = "Hello, " + currentUser.name;
    }

    if (profileEmail) {
        profileEmail.innerHTML =
            '<i class="fa-regular fa-envelope"></i> ' + currentUser.email;
    }

    if (favgenre) {
        favgenre.textContent = "Favourite Genres";
    }

    if (profileGenre) {
        profileGenre.textContent = currentUser.genre.join(", ");
    }
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", () => {

    localStorage.removeItem("currentUser");

    alert("Account logged out successfully");

    window.location.href = "signin.html";

});

const container = document.getElementById("favourites_container");

if (container) {
    container.style.color = "white";
}

function getCurrentUser():CurrentUser | null {
    return JSON.parse(localStorage.getItem("currentUser")||"null");
}

function getFavKey(): string | null {

    const user = getCurrentUser();

    if (!user || !user.email) {
        return null;
    }

    return `favourites_${user.email.trim().toLowerCase()}`;

}

function getFavourites(): SavedSeries[] {

    const key = getFavKey();

    if (!key) {
        return [];
    }

    return JSON.parse(localStorage.getItem(key) || "[]") as SavedSeries[];

}

function displayFavourites(): void {

    if (container) {
        container.innerHTML = "";
    }

    const user = getCurrentUser();

    if (!user) {

        if (container) {
            container.textContent = "Please signin";
        }

        return;
    }

    if (!container) return;

    const favourites = getFavourites();

    if (favourites.length === 0) {

        const message = document.createElement("p");

        message.textContent = "You haven't added any favourites yet.";

        container.appendChild(message);

        return;
    }

    favourites.forEach((item: SavedSeries) => {

        const card = document.createElement("div");

        card.classList.add("fav_card");

        const poster = document.createElement("img");

        poster.src = item.image || "";
        poster.alt = item.name;

        const title = document.createElement("h3");

        title.textContent = item.name;

        const rating = document.createElement("p");

        rating.innerHTML = `<i class="fa-solid fa-star"></i> ${item.rating ?? "N/A"}`;

        const genres = document.createElement("p");

        genres.textContent = (item.genres || []).join(", ");

        const removeBtn = document.createElement("button");

        removeBtn.classList.add("remove_fav");

        removeBtn.innerHTML =
            `Remove From <i class="fa-solid fa-bookmark"></i>`;

        removeBtn.addEventListener("click", () => {

            const key = getFavKey();

            if (!key) return;

            const updatedFavourites = getFavourites().filter(
                series => series.id !== item.id
            );

            localStorage.setItem(
                key,
                JSON.stringify(updatedFavourites)
            );

            displayFavourites();

        });

        card.appendChild(poster);
        card.appendChild(title);
        card.appendChild(rating);
        card.appendChild(genres);
        card.appendChild(removeBtn);

        container.appendChild(card);

    });

}

displayFavourites();

window.addEventListener("storage", (event: StorageEvent) => {

    if (event.key && event.key.startsWith("favourites_")) {
        displayFavourites();
    }

});

const watchlistContainer = document.getElementById("watchlist_container");

const pendingTab = document.getElementById("pendingTab");

const completedTab = document.getElementById("completedTab");

if (watchlistContainer) {
    watchlistContainer.style.color = "white";
}

const CurrentUser: CurrentUser | null = getCurrentUser();

if (!CurrentUser || !CurrentUser.email) {
    window.location.href = "./signin.html";
}

let currentTab: WatchlistTab = "pending";

function getWatchlistKey(): string | null {

    const user = getCurrentUser();

    if (!user || !user.email) {
        return null;
    }

    return `watchlist_${user.email.trim().toLowerCase()}`;

}

function displayWatchlist(): void {

    const key = getWatchlistKey();

    if (!key || !watchlistContainer) return;

    const watchlist: SavedSeries[] = JSON.parse(
        localStorage.getItem(key) || "[]"
    );

    watchlistContainer.innerHTML = "";

    const items = watchlist.filter(item => {
        return item.status === currentTab;
    });

    if (items.length === 0) {

        watchlistContainer.innerHTML = `

            <p class="text-gray-400 col-span-full mt-5">

                ${currentTab === "pending"
                    ? "No pending series found."
                    : "No completed series found."}

            </p>

        `;

        return;
    }

    items.forEach((item: SavedSeries) => {

        const card = document.createElement("div");

        card.classList.add("fav_card");

        card.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <h3 class="watch_title">
                ${item.name}
            </h3>

            <p class="watch_rating">
                <i class="fa-solid fa-star"></i>
                ${item.rating ?? "N/A"}
            </p>

            <p class="watch_genres">
                ${(item.genres || []).join(", ")}
            </p>

            ${currentTab === "pending" ? `
                <button class="statusBtn">
                    Mark as completed
                </button>
            ` : ""}

            <button class="remove_fav">
                Remove from <i class="fa-solid fa-outdent"></i>
            </button>

        `;

        watchlistContainer.appendChild(card);

        // STATUS BUTTON

        const statusBtn = card.querySelector(".statusBtn");

        if (statusBtn) {

            statusBtn.addEventListener("click", () => {

                const updatedList = watchlist.map(series => {

                    if (series.id === item.id) {

                        return {
                            ...series,
                            status: "completed" as const
                        };

                    }

                    return series;

                });

                localStorage.setItem(key, JSON.stringify(updatedList));

                displayWatchlist();

            });

        }

        // REMOVE BUTTON

        const removeBtn = card.querySelector(".remove_fav");

        removeBtn?.addEventListener("click", () => {

            const updatedList = watchlist.filter(series => {
                return series.id !== item.id;
            });

            localStorage.setItem(key, JSON.stringify(updatedList));

            displayWatchlist();

        });

    });

}

pendingTab?.addEventListener("click", () => {

    currentTab = "pending";

    pendingTab.classList.add("active_tab");

    completedTab?.classList.remove("active_tab");

    displayWatchlist();

});


completedTab?.addEventListener("click", () => {

    currentTab = "completed";

    completedTab.classList.add("active_tab");

    pendingTab?.classList.remove("active_tab");

    displayWatchlist();

});

displayWatchlist();


window.addEventListener("storage", (event: StorageEvent) => {

    if (event.key === getWatchlistKey()) {

        displayWatchlist();

    }

});