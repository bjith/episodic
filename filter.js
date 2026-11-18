const series=document.getElementById("mv")
series.classList.add("series_style")
const genre_select=document.getElementById("genres")
const sort_select=document.getElementById("sorting")
const type_select=document.getElementById("type")
let seriesData=[]

const footer = document.querySelector(".footer");


const backToTop=document.getElementById("backToTop")
window.addEventListener("scroll",()=>{
    const footerPosition = footer.getBoundingClientRect().top;
    if(scrollY>1500 && footerPosition>window.innerHeight){
        backToTop.style.display="flex"
    }
    else{
        backToTop.style.display="none"
    }
})

backToTop.addEventListener("click",()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
})

fetch("https://api.tvmaze.com/shows")
    .then(res => res.json())
    .then(data => {
        console.log(data);  

        seriesData=data;

        displaySeries(seriesData);
  
    });      
   
function displaySeries(data){

    series.innerHTML="";

data.forEach((element) => {
    const card=document.createElement("div")
    const poster=document.createElement("img")
    poster.src=element.image.medium;
    poster.classList.add("poster_style")
    card.appendChild(poster)
    card.classList.add("card_style")

    const rating_number=document.createElement("div")
    const rating_badge=document.createElement("div")
    const rating=document.createElement("div")
    rating_number.innerText=element.rating.average;
    rating_badge.innerHTML='<i class="fa-solid fa-star"></i>'
    rating.classList.add("rating_style")
    rating_badge.classList.add("rating_badge_style")
    rating_number.classList.add("rating_number_style")
    rating.appendChild(rating_badge)
    rating.appendChild(rating_number)
    card.appendChild(rating)

    const runtime=document.createElement("div")
    const runtime_icon=document.createElement("div")
    const runtime_box=document.createElement("div")
   
    
    if(element.runtime){
        runtime.innerHTML=element.runtime +"m"
         runtime_icon.innerHTML='<i class="fa-solid fa-clock"></i>'
    }
    else{
       runtime.style.display="none"
    }
    runtime.classList.add("runtime_style")
    runtime_icon.classList.add("runtime_icon_style")
    runtime_box.classList.add("runtime_box_style")
    runtime_box.appendChild(runtime)
    runtime_box.appendChild(runtime_icon)
    card.appendChild(runtime_box)

   

    const genres=document.createElement("div")
    element.genres.forEach(genretext=>{
        const genre_box=document.createElement("span")
        genre_box.textContent=genretext
        genre_box.classList.add("genre_box_style")
        genres.appendChild(genre_box)
    });
    genres.classList.add("genres_style")
    card.appendChild(genres)


    const title=document.createElement("h1")
    title.innerText=element.name
    title.classList.add("title_style")
    card.appendChild(title)


    
    // const summary=document.createElement("p")
    // summary.innerHTML=element.summary
    // card.appendChild(summary) 
    
    // const status=document.createElement("h3")
    // status.innerText=element.ended
    // card.appendChild(status)

  
    card.addEventListener("click",function () {
    showDetails(element.id)
});


    series.appendChild(card)



})


}


function filterandSort(){
    const selectedGenre=genre_select.value;
    const selectedSort=sort_select.value;
    const SelectedType=type_select.value;

    let result=[...seriesData];

    if(selectedGenre!='all'){
       result = result.filter((item) => {

            return item.genres.some((genre) =>
                genre.toLowerCase() === selectedGenre
            );

        });

    }

   
       if(selectedSort=='rating-higher'){
            result.sort((a,b)=>{
                return(
                    (b.rating.average)-(a.rating.average)
                );
            });

           
        }
        else if(selectedSort=='rating-lower'){
            result.sort((a,b)=>{
                const ratingA = a.rating.average;
                const ratingB = b.rating.average;

                if(ratingA==null)
                    return 1;
                if(ratingB==null)
                    return -1;

                return ratingA - ratingB
            })
        }
        else if(selectedSort=='latest'){
            result.sort((a,b)=>{
                return(
                    new Date(b.premiered) - new Date(a.premiered)
                );
            });
        }
        else if(selectedSort=='oldest'){
            result.sort((a,b)=>{
                return(
                    new Date(a.premiered) - new Date(b.premiered)
                );
            });
        }

        if(SelectedType!='all'){
           result = result.filter((item) => {

            return item.type === SelectedType
            

        });
        }

        

    

displaySeries(result)
}

genre_select.addEventListener("change", filterandSort);
sort_select.addEventListener("change",filterandSort);
type_select.addEventListener("change",filterandSort);




const details = document.getElementById("details")

function showDetails(id){

    series.style.display="none";
    const gfs=document.getElementById("gfs")
    gfs.style.display="none"
   
    
    

    Promise.all([
      fetch(`https://api.tvmaze.com/shows/${id}`).then(res => res.json()),
      fetch(`https://api.tvmaze.com/shows/${id}/crew`).then(res => res.json()),
      fetch(`https://api.tvmaze.com/shows/${id}/cast`).then(res => res.json())
        
       ]) .then(([data,crew,cast]) => {

       

            const maindiv = document.createElement("div")
            maindiv.classList.add("maindiv_style")
           
            const details_head = document.createElement("div")
            details_head.classList.add("dh_style")

            const details_poster = document.createElement("img")
    

            details_poster.src= data.image.medium;
            details_head.appendChild(details_poster)

            const tyc=document.createElement("div")
            tyc.classList.add("tyc_style")

            const title_year=document.createElement("div")
            title_year.classList.add("ty_style")

            const details_text = document.createElement("h1")
            details_text.innerText = data.name;
            details_text.classList.add("dTitle_style")
            title_year.appendChild(details_text)

            const year = document.createElement("p")
           year.innerText=data.premiered.split("-")[0]
           year.classList.add("year_style")
            title_year.appendChild(year)

            tyc.appendChild(title_year)

            const creator = crew.find(c=> c.type?.toLowerCase() == "creator");
            const creator_name = document.createElement("p")
            creator_name.innerText= creator? `Created By: ${creator.person.name}` :"Creator : Unknown"
            tyc.appendChild(creator_name)

           

           

            const d_genres = document.createElement("div")
            data.genres.forEach((item)=>{
                const d_genreBox=document.createElement("span")
                d_genreBox.textContent=item;
                d_genreBox.classList.add("dg_style")
                d_genres.appendChild(d_genreBox)
            })

            d_genres.classList.add("dgh_style")
            
           tyc.appendChild(d_genres);

              const det_status = document.createElement("p")
              det_status.classList.add("dets_style")
           if (data.status !== "Ended"){
           
            det_status.innerText = `Scheduled at :  ${data.schedule.days.join(", ")}  ${data.schedule.time}` ;
           
           }
           
           else{
            det_status.innerText=" Status: Series Ended"
           }

           tyc.appendChild(det_status)

            const drating_number=document.createElement("div")
             const drating_badge=document.createElement("div")
           const drating=document.createElement("div")
           drating_number.innerText="Rating : " + data.rating.average;
         drating_badge.innerHTML='<i class="fa-solid fa-star "></i>'
             drating.classList.add("drating_style")
          drating_badge.classList.add("drating_badge_style")
           drating_number.classList.add("drating_number_style")
           drating.appendChild(drating_badge)
           drating.appendChild(drating_number)
            tyc.appendChild(drating)




const actnBtn = document.createElement("div");


function getWatchlistKey() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || !user.email) {
        return null;
    }

    return `watchlist_${user.email.trim().toLowerCase()}`;
}


function getWatchlist() {

    const key = getWatchlistKey();

    if (!key) return [];

    return JSON.parse(localStorage.getItem(key)) || [];

}




const watchBtn = document.createElement("button");

watchBtn.classList.add("watch_style");


function updateWatchlistButton() {

    const watchlist = getWatchlist();

    const exists = watchlist.some(item => item.id === data.id);

    watchBtn.classList.toggle("watch_toggle", exists);

    watchBtn.innerHTML = exists
        ? ` In Watchlist <i class="fa-solid fa-clock"></i>`
        : ` Add to Watchlist <i class="fa-regular fa-clock"></i> `;

}


updateWatchlistButton();



watchBtn.addEventListener("click", () => {

    const key = getWatchlistKey();

    if (!key) {

        alert("Please sign in to use your Watchlist");

        return;

    }


    let watchlist = JSON.parse(localStorage.getItem(key)) || [];

    const exists = watchlist.some(item => item.id === data.id);


    if (exists) {

        watchlist = watchlist.filter(item => item.id !== data.id);

    }

    else {

        watchlist.push({

            id: data.id,
            name: data.name,
            image: data.image?.medium || "",
            rating: data.rating?.average ?? null,
            genres: data.genres || [],
            summary: data.summary || "",
            status: "pending"

        });

    }


    localStorage.setItem(key, JSON.stringify(watchlist));

    updateWatchlistButton();

});


actnBtn.appendChild(watchBtn);




            const fav = document.createElement("button");
            fav.classList.add("fav_style");

            function getCurrentUser(){
                return JSON.parse(localStorage.getItem("currentUser"));
            }

            function getFavKey(){
                const user = getCurrentUser();

                if(!user || !user.email){
                    return null;
                }
                return `favourites_${user.email.trim().toLowerCase()}`;
            }
            
            function getFavourites() {
                const key = getFavKey();
                if(!key){
                    return [];
                }
                return JSON.parse(localStorage.getItem(key  )) || [];
            }
            
           
            function updateFavButton() {
                const favourites = getFavourites();
            
                const exists = favourites.some(item => item.id === data.id);
            
                fav.classList.toggle("fav_toggle", exists);
            
                fav.innerHTML = exists
                    ? `Added To Favourites <i class="fa-solid fa-bookmark"></i>`
                    : `Add To Favourites <i class="fa-regular fa-bookmark"></i>`;
            }
            
            
            updateFavButton();
            
            fav.addEventListener("click", () => {

                const key = getFavKey();
                if(!key){
                    alert("please signin to add favourites")
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
                        image: data.image?.medium,
                        rating: data.rating?.average,
                        genres: data.genres || [],
                        summary: data.summary || ""
                    });
                }
            
                localStorage.setItem(key, JSON.stringify(favourites));
            
                
                updateFavButton();
            });
            
            actnBtn.appendChild(fav);


            tyc.appendChild(actnBtn)


            details_head.appendChild(tyc)
           

            maindiv.appendChild(details_head)



           const button=document.createElement("button")
           button.innerHTML=`<button onclick="goback()"><i class="fa-solid fa-angle-left"></i> Back</button>`
           
           button.classList.add("backbutton")
           details_head.appendChild(button)
            
            maindiv.style.color = "white"
            maindiv.style.fontSize="17.5px"
            details.appendChild(maindiv)


           const details_summary = document.createElement("p")
           details_summary.innerHTML =  data.summary;
           details_summary.classList.add("detailssummary_style")
           maindiv.appendChild(details_summary)


          

          


// cast_____________-------
           const actortitle = document.createElement("h1")
           actortitle.innerText="Cast"
           actortitle.classList.add("actortitle_style")
           maindiv.appendChild(actortitle)

            const main_box_actor = document.createElement("div")
            
            main_box_actor.classList.add("mainactor_style")

            
           

           cast.forEach(elem =>{

            

            const actor_main = document.createElement("div")
            actor_main.classList.add("mainactor")

            const actor_im = document.createElement("img")
            actor_im.src= elem.person.image.medium;
            actor_im.classList.add("actorim")
            actor_main.append(actor_im)

            const actor = document.createElement("p")
            actor.innerText=elem.person.name;
            actor.classList.add("actorstyle")
            actor_main.append(actor)

            const character = document.createElement("p")
            character.innerText=elem.character.name
            character.classList.add("characterStyle")
            actor_main.append(character)


         

            main_box_actor.appendChild(actor_main)

            maindiv.appendChild(main_box_actor)

           })
            

        });

}

function goback(){
    details.innerHTML="";
    series.style.display="grid"
    gfs.style.display="block"
}

