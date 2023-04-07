function sign_login() {
    location.href = '/user/signup';
}

function getRestaurants() {
    fetch('/restaurant')
    .then(res => res.json())
    .then(data => {
        displayRestaurants(data.result);
        filterRestaurants(data.result);
        checkAuth(data.auth);
    })
    .catch(err => console.log(err));
}

function displayRestaurants(restaurants){
    let container = document.getElementById('allRes');
    if (restaurants.length > 0){
        container.innerHTML = '';
        restaurants.forEach(restaurant => {
            let averageRating = restaurant.average;
            if (restaurant.average === null){
                averageRating = 'Not yet rated'
            }

            let yellowStar = '';
            let star = '';
            
            if (restaurant.average !== null) {
                let rating_1dp = restaurant.average.toFixed(1);
                averageRating = rating_1dp;
                let roundRating = Math.round(restaurant.average);
    
                for(let i = 0; i<roundRating; i++){
                    yellowStar += '<i style = "color:yellow"class="fas fa-star"></i>';
                }
                for(let x = 0; x<5-roundRating; x++){
                    star += '<i class="fas fa-star"></i>';
                }
            }
            let content = `<a style = 'color : black;text-decoration:none' href = '/restaurant.html/${restaurant.restaurant_id}' target = '_blank'>
                        <div class = 'single_res'>
                            <img style = 'object-fit: cover;width: 100%; height: 50%;'src = ${restaurant.poster}>
                            <div class = 'resDetails'>
                                <h3>${restaurant.name}</h3>
                                <p>${averageRating} ${yellowStar+=star}</p>
                                <p>${restaurant.description}</p>
                            </div>
                        </div>
                    </a>`;
            container.insertAdjacentHTML('beforeend', content);
            
        });

    }
}

function filterRestaurants(restaurants){
    const search = document.getElementById('search-box');
    const matches = document.getElementById('search-result');
    search.addEventListener('input', () => {
        let regex = new RegExp(`^${search.value}`, 'gi');
        let results = restaurants.filter(restaurant => {
            return restaurant.name.match(regex)
        });
        
        
        if (search.value.length === 0){
            results = [];
            matches.innerHTML = '';
            
        }
        else{
            let html = results.map(result => {
                return `<a href = '/restaurant.html/${result.restaurant_id}' target = '_blank'>
                <div class = 'suggestion'>
                    <img src = ${result.poster} alt = 'thumbnail'/>
                    <h3>${result.name}</h3>
                </div>
                </a>`
            }).join('');
    
            matches.innerHTML = html;
        }
    });
}

function checkAuth(authStatus){
    if (authStatus !== false){
        let btn = document.getElementById('sign-login-btn');
        btn.textContent = authStatus + "'s profile";
        btn.onclick = goProfile;
    }
}

function goProfile(){
    location.href = '/user/profile'
}

