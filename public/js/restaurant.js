function openTab(element,tabName){
    let everything = document.getElementsByClassName('res');
    let allTab = document.getElementsByClassName('tablink');
    for (let i = 0;i<everything.length;i++){
        everything[i].style.display = 'none';
    }

    for (let x = 0;x<allTab.length;x++){
        allTab[x].classList.remove('active');
    }

    document.getElementById(tabName).style.display = 'block';
    element.classList.add('active');
}


function openModal(){
    let modal = document.querySelector('#write-modal');
    modal.classList.add('active');
    
    let modalBg = document.querySelector('.overlay');
    modalBg.classList.add('active');
}

function closeModal(){
    let modal = document.querySelector('#write-modal');
    modal.classList.remove('active');
    
    let modalBg = document.querySelector('.overlay');
    modalBg.classList.remove('active');
}

let rating = '0';
function rate(element) {
    let allStars = document.querySelectorAll('.rating i');
    let value = element.dataset.rate;
    rating = value;
    for(let x = 0; x < allStars.length; x++) {
        allStars[x].style.color = 'initial';
    }
    for(let i = 0; i < value; i++){
        allStars[i].style.color = 'yellow';
    }
}

const form = document.querySelector('#write');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let url = location.href;
    let index = url.lastIndexOf('/');
    let id = url.substring(index + 1);

    let comment = form.comment.value;


    fetch(`/restaurant/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({rating, comment}),
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(msg => {
        if (msg.error) {
            location.href = '/user/signup'
        }
        else if (msg.user) {
            location.reload()
        }
    })
    .catch(err => console.log(err))
})

let overviewIsCalled = false;

function getOverview() {
    if (overviewIsCalled !== true){
        let url = location.href;
        let index = url.lastIndexOf('/');
        let id = url.substring(index + 1);
        fetch (`/restaurant/${id}`)
        .then(res => res.json())
        .then(data => displayOverview(data))
        .catch(err => console.log(err));
    }
}

function displayOverview(details) {
    overviewIsCalled = true;
    let restaurantName = document.getElementById('name');
    restaurantName.textContent = details.data[0].name;

    let backgroundImage = document.querySelector('.poster');
    backgroundImage.style.backgroundImage = `url('${details.data[0].poster}')`;

    let container = document.getElementById('overview');
    
    container.innerHTML = '';
    let averageRating = details.avg_count[0].Average;
    if (averageRating === null){
        averageRating = 'Not yet rated';
    }

    let yellowStar = '';
    let star = '';

    if (details.avg_count[0].Count !== 0) {
        var rating_1dp = details.avg_count[0].Average.toFixed(1);
        averageRating = rating_1dp;
        let roundRating = Math.round(details.avg_count[0].Average);
        
        for(let i = 0; i<roundRating; i++){
            yellowStar += '<i style = "color:yellow"class="fas fa-star"></i>';
        }
        for(let x = 0; x<5-roundRating; x++){
            star += '<i class="fas fa-star"></i>';
        }
    }
    // Do not misuse my API key
    let content = `<div class = 'details'>
    <div>
        <p><span class = 'subheading'><i style = 'margin-right:5px;' class="fas fa-business-time"></i>Opening hours</span> <br> ${details.data[0].opening_hours} </p>
        <p><span class = 'subheading'><i style = 'margin-right:5px;' class="fas fa-thumbtack"></i>Location</span> <br> ${details.data[0].location}</p>
        <p><span class = 'subheading'><i style = 'margin-right:5px;' class="fas fa-utensils"></i>Cuisine</span> <br> ${details.data[0].cuisine}</p>
    </div>
    <div>
        <p><span class = 'subheading'><i style = 'margin-right:5px;' class="fas fa-star"></i>Average Rating</span> <br> ${averageRating} ${yellowStar+=star} | ${details.avg_count[0].Count} Reviews</p>
        <p><span class = 'subheading'><i style = 'margin-right:5px;' class="fas fa-phone-alt"></i>Phone Number</span> <br> ${details.data[0].phone_number}</p>
    </div>
</div>
<p class = 'des'>${details.data[0].description}</p>
<iframe style = 'display: block;margin: auto;margin-bottom: 50px' width = '800px'height = '300px' loading = 'lazy' src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyA91RlqJL37evDsekNr5THiO_L45YP9iuo&q=${details.data[0].location}'></iframe>`;
    container.insertAdjacentHTML('beforeend', content);
}

let reviewIsCalled = false;

function getReviews() {
    if (reviewIsCalled !== true){
        let url = location.href;
        let index = url.lastIndexOf('/');
        let id = url.substring(index + 1);
        fetch(`/restaurant/${id}/reviews`)
        .then(res => res.json())
        .then(data => displayReviews(data))
        .catch(err => console.log(err));
    }
}

function displayReviews(reviews) {
    reviewIsCalled = true;
    let container = document.getElementById('reviews');
    let container2 = document.getElementById('innerContainer');
    let content = undefined;
    
    if (reviews.avg_count[0].Count !== 0) {
        let rating_1dp = reviews.avg_count[0].Average.toFixed(1);
        let roundRating = Math.round(reviews.avg_count[0].Average);
        let yellowStar = '';
        let star = '';
        for(let i = 0; i<roundRating; i++){
            yellowStar += '<i style = "color:yellow"class="fas fa-star"></i>';
        }
        for(let x = 0; x<5-roundRating; x++){
            star += '<i class="fas fa-star"></i>';
        }
        content = `<div class = 'info'>
        <p><span class = 'subheading'>Average Rating</span> <br> ${rating_1dp} ${yellowStar+=star} | ${reviews.avg_count[0].Count} Reviews</p>
        <button onclick = 'openModal()'>Write a review</button>
    </div>`
    }else {
        content = `<div class = 'info'>
        <p><span class = 'subheading'>Average Rating</span> <br> Not yet rated | 0 Reviews</p>
        <button onclick = 'openModal()'>Write a review</button>
    </div>`
    }
    
    container.insertAdjacentHTML('afterbegin',content);

    if (reviews.data.length > 0){
        reviews.data.forEach(review => {
            let yellowStar = '';
            let star = '';
            for(let i = 0; i<review.rating; i++){
                yellowStar += '<i style = "color:yellow"class="fas fa-star"></i>';
            }
            for(let x = 0; x<5-review.rating; x++){
                star += '<i class="fas fa-star"></i>'
            }
            let content2 = `<div class = 'single_review'>
            <div class = 'userRating'>
                <div>
                    ${yellowStar+=star}
                </div>
                <div>
                    <button data-id = ${review.review_id} class = 'review-btn' title = 'Edit review' onclick = 'openUpdateModal(this)'><i class="fas fa-edit"></i></button>
                    <button data-id = ${review.review_id} class = 'review-btn' title = 'Delete review' onclick = 'deleteReview(this)'><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <p style = 'font-size: 18px'>${review.comment}</p>
            <p style = 'font-size: 14px; color : gray'>By ${review.username} | Review made on ${review.datePosted}</p>
            <hr>
        </div>`
        container2.insertAdjacentHTML('beforeend',content2);
        })
    }

}
let photoIsCalled = false;
function getPhotos() {
    if (photoIsCalled !== true){
        let url = location.href;
        let index = url.lastIndexOf('/');
        let id = url.substring(index + 1);
        fetch(`/restaurant/${id}/photos`)
        .then(res => res.json())
        .then(data => displayPhotos(data))
        .catch(err => console.log(err));
    }
}

function displayPhotos(photos){
    photoIsCalled = true;
    let container = document.getElementById('photos');
    photos.forEach(photo => {
        let content = `<img src = '${photo.url}'  alt = 'restaurant image'/>`
        container.insertAdjacentHTML('beforeend' , content);
    })
}

