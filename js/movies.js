
function getData(url, callbackFunc) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callbackFunc(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function successAjax(xhttp) {
    let moviesData = (JSON.parse(xhttp.responseText))[0].movies;
    console.log(moviesData);

    sortByTitle(moviesData);
    //capitalizeFirstLetter(moviesData);
    realizeData(moviesData);
    document.getElementById('search-button').addEventListener('click', function () {
        search(moviesData);
    });
    countTime(moviesData);
    filterActor(moviesData);
    countCategories(moviesData);
}

getData('/json/movies.json', successAjax);

function sortByTitle(data){
        data.sort(function (a, b) {
            let titleA = a.title.toLowerCase();
            let titleB = b.title.toLowerCase();
            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }
            return 0;
        });
}


/*function capitalizeFirstLetter(data) {
    for(i = 0; i < data.length; i++){
        for(j = 0; j < data.categories.length; j++){
            let firstLetter = data[i].categories[j];
            return firstLetter[0].toUpperCase() + firstLetter.slice(1);
        }
}*/


function nameToImageName(title){
    const HUNCHARS = {
        á: 'a',
        é: 'e',
        í: 'i',
        ó: 'o',
        ú: 'u',
        ö: 'o',
        ü: 'u',
        ő: 'o',
        Ű: 'u'
    }
    title = title.toLocaleLowerCase();
    title = title.replace(/[áéíóúöüőű]/g, c => HUNCHARS[c]);
    title = title.replace(/[^a-z0-9 -]/g, '');
    title = title.replace(/[ -]+/g, '-');
    return title
}


function getMovies(movie){
    let allDataOfOneMovie = {
                    title: 'Cím',
                    timeInMinutes: 'Hossz',
                    premierYear: 'Premier',
                    categories: 'Kategória',
                    directors: 'Rendező',
                    cast: 'Szereplők'
                    }
    let element = `<div class="movie">`;
                    element += `<img src="/img/covers/${nameToImageName(movie.title)}.jpg"></img>`;
                    for(let i in movie){
                        let movieKeys = `${allDataOfOneMovie[i]}: `;
                        switch (i){
                            case 'timeInMinutes': 
                            movieKeys += `${movie[i]} perc `; 
                            break;
                            case 'directors':
                            case 'categories' :
                            movieKeys += movie[i].join(', ');
                            break;
                            case 'cast':
                            movieKeys += '<br>' + actorName(movie.cast);
                            break;
                            default:
                            movieKeys += movie[i];
                        }
                        element += `<p>${movieKeys}</p>`;
                    }
                    element += '</div>';
    return element;

}

function actorName(data){
    let cast = '';
    for(let i in data){
        cast += `<img id ="cast" src="/img/actors/${nameToImageName(data[i].name)}.jpg"></img>`;
        cast += `<p id="cast-name">${data[i].name} (${data[i].characterName})</p>`;
        cast += `<p id="cast-info">${data[i].birthYear}, ${data[i].birthCountry}, ${data[i].birthCity}</p>`;
    }
    return cast;
}

function realizeData(data, i){
    for (let i in data){
        document.getElementById('movies').innerHTML += getMovies(data[i]);
    }
}

function search(data){
    let searchTitle = document.getElementById('search1');
    let givenTitle = searchTitle.value.toLowerCase();
    let searchDirector = document.getElementById('search2');
    let givenDirector = searchDirector.value.toLowerCase();
    let searchActor = document.getElementById('search3');
    let givenActor = searchActor.value.toLowerCase();
    
    for(let i = 0; i < data.length; i++){
    if(givenTitle && (data[i].title).toLowerCase().indexOf(givenTitle > -1)){
        realizeData(data, i);
        searchTitle.value = data[i].title;
        break;
    }
    if(givenDirector && (data[i].directors).toLowerCase().indexOf(givenDirector > -1)){
        realizeData(data, i);
        searchDirector.value = data[i].directors;
        break;
    }
    if(givenActor && (data[i].cast).toLowerCase().indexOf(givenActor > -1)){
        realizeData(data, i);
        searchActor.value = data[i].cast;
        break;
    }
    else {
        document.getElementById('notFound').innerHTML = 'Nincs a keresésnek megfelelő érték';
    }
}
}

function countTime(data){
    let countedTime = 0;
    for(let i in data){
        countedTime += parseInt(data[i].timeInMinutes);
    }
document.getElementById('statistic1').innerHTML = `<p>Az összes film hossza: ${(countedTime/60).toFixed(2)} óra.</p>`;
document.getElementById('statistic2').innerHTML = `<p>Az összes film hosszának az átlaga: ${((countedTime/60)/data.length).toFixed(2)} óra.</p>`;
}

function filterActor(data){
    let actorNumber = new Map();
    for(let i = 0; i < data.length; i++){
        for(let j = 0; j < data[i].cast.length; j++)
            if (actorNumber.has(data[i].cast[j][0])){
           let newValue = actorNumber.get(data[i].cast[j][0]) + 1;
           actorNumber.set(data[i].cast[j][0], newValue) 
             }
             else {
           actorNumber.set(data[i].cast[j][0], 1)
       } 
    }
    for (let i of actorNumber) {
    document.getElementById('filter').innerHTML = `<p>A színész neve: ${i[0]} ennyi filmben szerepelt: ${i[1]}.</p>`
    }
}


function countCategories(data){
    let categoriesNumber = new Map();
    for(let i = 0; i < data.length; i++){
        for(let j = 0; j < data[i].categories.length; j++)
            if (categoriesNumber.has(data[i].categories[j])){
           let newValue = categoriesNumber.get(data[i].categories[j]) + 1;
           categoriesNumber.set(data[i].categories[j], newValue) 
             }
             else {
           categoriesNumber.set(data[i].cast[j], 1)
       } 
    }
    for (let i of categoriesNumber) {
    document.getElementById('countCategories').innerHTML = `<p>A filmkategória neve: ${i[0]}, az adott kategóriába ennyi film tartozik: ${i[1]}.</p>`
    }
}