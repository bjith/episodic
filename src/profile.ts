interface Series {
    id: number;
    name: string;
    image: {
        medium: string;
    } | null;
    rating: {
        average: number | null;
    };
    runtime: number | null;
    genres: string[];
    premiered: string | null;
    type: string;
    status: string;
    schedule: {
        days: string[];
        time: string;
    };
    summary: string | null;
}

interface CrewMember {
    type: string | null;
    person: {
        name: string;
    };
}

interface CastMember {
    person: {
        name: string;
        image: {
            medium: string | null;
        } | null;
    };
    character: {
        name: string;
    };
}

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
    summary:string;
}

type WatchlistTab = "pending" | "completed";


const details = document.getElementById("details") as HTMLDivElement;

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

        card.addEventListener("click",function(){
            showDetails(item.id)
        })

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

        card.addEventListener("click",function(){
            showDetails(item.id)
        })

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

const favwatch = document.querySelector<HTMLDivElement>(".favwatch");

function showDetails(id:number):void{
    if(proclr){
        proclr.style.display="none"
    }
    if(container){
        container.style.display="none"
    }
    if(watchlistContainer){
        watchlistContainer.style.display="none"
    }

    if(favwatch){
        favwatch.style.display="none"
    }

    Promise.all([
         fetch(`https://api.tvmaze.com/shows/${id}`).then(res => res.json()),
        fetch(`https://api.tvmaze.com/shows/${id}/crew`).then(res => res.json()),
        fetch(`https://api.tvmaze.com/shows/${id}/cast`).then(res => res.json())
    ]).then(([data,crew,cast]:[Series,CrewMember[],CastMember[]])=>{
        
     const maindiv = document.createElement("div");
maindiv.classList.add("maindivp_style");

const details_head = document.createElement("div");
details_head.classList.add("dh_style");

const details_poster = document.createElement("img");

details_poster.src = data.image?.medium ?? "";
details_poster.classList.add("detpost_style")
details_head.appendChild(details_poster);


const tyc = document.createElement("div");
tyc.classList.add("tyc_style");

const title_year = document.createElement("div");
title_year.classList.add("ty_style");

const details_text = document.createElement("h1");

details_text.innerText = data.name;
details_text.classList.add("dTitle_style");

title_year.appendChild(details_text);

const year = document.createElement("p");

year.innerText = data.premiered?.split("-")[0] ?? "Unknown";
year.classList.add("year_style");

title_year.appendChild(year);

tyc.appendChild(title_year);

const creator = crew.find(
    c => c.type?.toLowerCase() === "creator"
);

const creator_name = document.createElement("p");

creator_name.innerText = creator
    ? `Created By: ${creator.person.name}`
    : "Creator: Unknown";

tyc.appendChild(creator_name);

const d_genres = document.createElement("div");

data.genres.forEach((item) => {

    const d_genreBox = document.createElement("span");

    d_genreBox.textContent = item;
    d_genreBox.classList.add("dg_style");

    d_genres.appendChild(d_genreBox);

});

d_genres.classList.add("dgh_style");

tyc.appendChild(d_genres);

const det_status = document.createElement("p");

det_status.classList.add("dets_style");

if (data.status !== "Ended") {

    det_status.innerText =
        `Scheduled at: ${data.schedule.days.join(", ")} ${data.schedule.time}`;

} else {

    det_status.innerText = "Status: Series Ended";

}

tyc.appendChild(det_status);

const drating_number = document.createElement("div");
const drating_badge = document.createElement("div");
const drating = document.createElement("div");

drating_number.innerText = "Rating: " + (data.rating.average ?? "N/A");

drating_badge.innerHTML = '<i class="fa-solid fa-star"></i>';

drating.classList.add("drating_style");
drating_badge.classList.add("drating_badge_style");
drating_number.classList.add("drating_number_style");

drating.appendChild(drating_badge);
drating.appendChild(drating_number);

tyc.appendChild(drating);


function getCurrentUser(): CurrentUser | null {
    const userData = localStorage.getItem("currentUser");

    if (!userData) {
        return null;
    }

    return JSON.parse(userData) as CurrentUser;
}

const actnBtn = document.createElement("div");

function getWatchlistKey(): string | null {
    const user = getCurrentUser();

    if (!user || !user.email) {
        return null;
    }

    return `watchlist_${user.email.trim().toLowerCase()}`;
}

function getWatchlist(): SavedSeries[] {
    const key = getWatchlistKey();

    if (!key) {
        return [];
    }

    const savedData = localStorage.getItem(key);

    return savedData ? JSON.parse(savedData) as SavedSeries[] : [];
}

const watchBtn = document.createElement("button");

watchBtn.classList.add("watch_style");

function updateWatchlistButton(): void {

    const watchlist = getWatchlist();

    const exists = watchlist.some(item => item.id === data.id);

    watchBtn.classList.toggle("watch_toggle", exists);

    watchBtn.innerHTML = exists
        ? `In Watchlist <i class="fa-solid fa-clock"></i>`
        : `Add to Watchlist <i class="fa-regular fa-clock"></i>`;
}

updateWatchlistButton();

watchBtn.addEventListener("click", () => {

    const key = getWatchlistKey();

    if (!key) {
        alert("Please sign in to use your Watchlist");
        return;
    }

    let watchlist = getWatchlist();

    const exists = watchlist.some(item => item.id === data.id);

    if (exists) {

        watchlist = watchlist.filter(item => item.id !== data.id);

    } else {

        watchlist.push({
            id: data.id,
            name: data.name,
            image: data.image?.medium ?? "",
            rating: data.rating.average,
            genres: data.genres,
            summary: data.summary ?? "",
            status: "pending"
        });

    }

    localStorage.setItem(key, JSON.stringify(watchlist));

    updateWatchlistButton();
});

actnBtn.appendChild(watchBtn);

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

    const savedData = localStorage.getItem(key);

    return savedData
        ? JSON.parse(savedData) as SavedSeries[]
        : [];
}

const fav = document.createElement("button");

fav.classList.add("fav_style");

function updateFavButton(): void {

    const favourites = getFavourites();

    const exists = favourites.some(item => item.id === data.id);

    fav.classList.toggle("fav_toggle", exists);

    fav.innerHTML = exists
        ? `Added To  <i class="fa-solid fa-bookmark"></i>`
        : `Add To Favourites <i class="fa-regular fa-bookmark"></i>`;
}

updateFavButton();

fav.addEventListener("click", () => {

    const key = getFavKey();

    if (!key) {
        alert("Please sign in to add favourites");
        return;
    }

    let favourites = getFavourites();

    const exists = favourites.some(item => item.id === data.id);

    if (exists) {

        favourites = favourites.filter(item => item.id !== data.id);

    } else {

        favourites.push({
            id: data.id,
            name: data.name,
            image: data.image?.medium ?? "",
            rating: data.rating.average,
            genres: data.genres,
            summary: data.summary ?? ""
        });

    }

    localStorage.setItem(key, JSON.stringify(favourites));

    updateFavButton();
});

actnBtn.appendChild(fav);


tyc.appendChild(actnBtn);
details_head.appendChild(tyc);

maindiv.appendChild(details_head);

const button = document.createElement("button");

button.innerHTML = '<i class="fa-solid fa-angle-left"></i> Back';

button.classList.add("backbutton");

button.addEventListener("click", goback);

details_head.appendChild(button);

maindiv.style.color = "white";
maindiv.style.fontSize = "17.5px";

details.appendChild(maindiv);

const details_summary = document.createElement("p");

details_summary.innerHTML = data.summary ?? "No summary available.";

details_summary.classList.add("detailssummary_style");

maindiv.appendChild(details_summary);

const actortitle = document.createElement("h1");

actortitle.innerText = "Cast";

actortitle.classList.add("actortitle_style");

maindiv.appendChild(actortitle);
const main_box_actor = document.createElement("div");

main_box_actor.classList.add("mainactor_style");

cast.forEach((elem) => {

    const actor_main = document.createElement("div");

    actor_main.classList.add("mainactor");

    const actor_im = document.createElement("img");

    actor_im.src = elem.person.image?.medium ?? "";

    actor_im.classList.add("actorim");

    actor_main.appendChild(actor_im);

    const actor = document.createElement("p");

    actor.innerText = elem.person.name;

    actor.classList.add("actorstyle");

    actor_main.appendChild(actor);

    const character = document.createElement("p");

    character.innerText = elem.character.name;

    character.classList.add("characterStyle");

    actor_main.appendChild(character);

    main_box_actor.appendChild(actor_main);

    if(!cast){
        maindiv.innerText="There is no cast"
    }

});

maindiv.appendChild(main_box_actor);

    });

    

}


function goback(): void {

    details.innerHTML = "";

    if(proclr){
        proclr.style.display="block"
    }

    if(container){
        container.style.display="grid"
    }
    if(watchlistContainer){
        watchlistContainer.style.display="grid"
    }
    if(favwatch){
        favwatch.style.display="block"
    }
}
