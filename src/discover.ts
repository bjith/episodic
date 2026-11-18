

interface DiscoverShow {
    id: number;
    name: string;
    image: {
        medium: string;
    } | null;
    rating: {
        average: number | null;
    };
}

interface SearchResult {
    show: DiscoverShow;
}

const search_input = document.getElementById("search") as HTMLInputElement;

search_input.classList.add("input_style");

const search_results = document.getElementById("mv") as HTMLDivElement;

search_input.addEventListener("input", () => {

    const searchText: string = search_input.value.trim();

    if (searchText === "") {

        search_results.innerHTML = "";

        return;
    }

    fetch(`https://api.tvmaze.com/search/shows/?q=${encodeURIComponent(searchText)}`)

    .then(res => res.json())

    .then((data : SearchResult[] )=> {

        console.log(data);

        search_results.innerHTML = "";

     data.forEach((item) => {

    const show = item.show;

    const card = document.createElement("div");

    card.classList.add("discover_card");

    
    const poster = document.createElement("img");

    if (show.image) {
        poster.src = show.image.medium;
    } else {
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

