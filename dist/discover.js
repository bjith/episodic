const search_input = document.getElementById("search");
search_input.classList.add("input_style");
const searchBar = document.getElementById("searchBar");
const details = document.getElementById("details");
const search_results = document.getElementById("mv");
search_input.addEventListener("input", () => {
    const searchText = search_input.value.trim();
    if (searchText === "") {
        search_results.innerHTML = "";
        return;
    }
    fetch(`https://api.tvmaze.com/search/shows/?q=${encodeURIComponent(searchText)}`)
        .then(res => res.json())
        .then((data) => {
        console.log(data);
        search_results.innerHTML = "";
        data.forEach((item) => {
            const show = item.show;
            const card = document.createElement("div");
            card.classList.add("discover_card");
            card.addEventListener("click", function () {
                showDetails(show.id);
            });
            const poster = document.createElement("img");
            if (show.image) {
                poster.src = show.image.medium;
            }
            else {
                poster.src = "./assets/error_image.jpg";
            }
            poster.classList.add("poster_style");
            card.appendChild(poster);
            const title = document.createElement("h3");
            title.innerText = show.name;
            title.classList.add("discover_text");
            card.appendChild(title);
            const rating = document.createElement("p");
            if (show.rating.average !== null) {
                rating.innerText = "Rating : " + show.rating.average;
            }
            rating.classList.add("discover_rating");
            card.appendChild(rating);
            search_results.appendChild(card);
        });
    })
        .catch(error => {
        console.log("Error:", error);
    });
});
function showDetails(id) {
    search_results.style.display = "none";
    searchBar.style.display = "none";
    Promise.all([
        fetch(`https://api.tvmaze.com/shows/${id}`).then(res => res.json()),
        fetch(`https://api.tvmaze.com/shows/${id}/crew`).then(res => res.json()),
        fetch(`https://api.tvmaze.com/shows/${id}/cast`).then(res => res.json())
    ]).then(([data, crew, cast]) => {
        const maindiv = document.createElement("div");
        maindiv.classList.add("maindivd_style");
        const details_head = document.createElement("div");
        details_head.classList.add("dh_style");
        const details_poster = document.createElement("img");
        details_poster.src = data.image?.medium ?? "";
        details_poster.classList.add("detpost_style");
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
        const creator = crew.find(c => c.type?.toLowerCase() === "creator");
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
        }
        else {
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
        function getCurrentUser() {
            const userData = localStorage.getItem("currentUser");
            if (!userData) {
                return null;
            }
            return JSON.parse(userData);
        }
        const actnBtn = document.createElement("div");
        function getWatchlistKey() {
            const user = getCurrentUser();
            if (!user || !user.email) {
                return null;
            }
            return `watchlist_${user.email.trim().toLowerCase()}`;
        }
        function getWatchlist() {
            const key = getWatchlistKey();
            if (!key) {
                return [];
            }
            const savedData = localStorage.getItem(key);
            return savedData ? JSON.parse(savedData) : [];
        }
        const watchBtn = document.createElement("button");
        watchBtn.classList.add("watch_style");
        function updateWatchlistButton() {
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
            }
            else {
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
        function getFavKey() {
            const user = getCurrentUser();
            if (!user || !user.email) {
                return null;
            }
            return `favourites_${user.email.trim().toLowerCase()}`;
        }
        function getFavourites() {
            const key = getFavKey();
            if (!key) {
                return [];
            }
            const savedData = localStorage.getItem(key);
            return savedData
                ? JSON.parse(savedData)
                : [];
        }
        const fav = document.createElement("button");
        fav.classList.add("fav_style");
        function updateFavButton() {
            const favourites = getFavourites();
            const exists = favourites.some(item => item.id === data.id);
            fav.classList.toggle("fav_toggle", exists);
            fav.innerHTML = exists
                ? `Added To <i class="fa-solid fa-bookmark"></i>`
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
            }
            else {
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
            if (!cast) {
                maindiv.innerText = "There is no cast";
            }
        });
        maindiv.appendChild(main_box_actor);
    });
}
function goback() {
    details.innerHTML = "";
    search_input.style.display = "block";
    search_results.style.display = "grid";
}
export {};
//# sourceMappingURL=discover.js.map