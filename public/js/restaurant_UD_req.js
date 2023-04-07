let updatedRating = '0';
function updateRate(element) {
    let allStars = document.querySelectorAll('.updateRating i');
    let value = element.dataset.rate;
    updatedRating = value;
    for(let x = 0; x < allStars.length; x++) {
        allStars[x].style.color = 'initial';
    }
    for(let i = 0; i < value; i++){
        allStars[i].style.color = 'yellow';
    }
}

function openUpdateModal(element){
    let modal = document.querySelector('#update-modal');
    modal.classList.add('active');
    
    let modalBg = document.querySelector('.overlay');
    modalBg.classList.add('active');

    let updateForm = document.getElementById('update');
    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        let url = location.href;
        let index = url.lastIndexOf('/');
        let restaurant_id = url.substring(index + 1);
        let updateComment = updateForm.updateComment.value;

        try{
            const res = await fetch(`/restaurant/${restaurant_id}/reviews/${element.dataset.id}`, {
                method:'PUT',
                body: JSON.stringify({updatedRating, updateComment}),
                headers: {'Content-Type': 'application/json'}
            });

            const msg = await res.json();
            if (msg.redirect){
                location.href = msg.redirect;
            }
            else if (msg.error){
                closeUpdateModal();
                alert(msg.error)
            }
            else if (msg.user) {
                location.reload();
            }

        }
        catch(err){
            console.log(err)
        }
        

    }, {once : true})
}

function closeUpdateModal(){
    modal = document.querySelector('#update-modal');
    modal.classList.remove('active');
    
    let modalBg = document.querySelector('.overlay');
    modalBg.classList.remove('active');

}

function deleteReview(element) {
    let confirmation = confirm('Are you sure you want to delete this review')
    if (confirmation === true){
        let url = location.href;
        let index = url.lastIndexOf('/');
        let restaurant_id = url.substring(index + 1);
        let review_id = element.dataset.id;
        fetch(`/restaurant/${restaurant_id}/reviews/${review_id}`, {
        method : 'DELETE',
        })
        .then(res => res.json())
        .then(msg => checkMsg(msg))
        .catch(err => console.log(err));

    }
}

function checkMsg(msg) {
    if (msg.error) {
        alert(msg.error);
    }
    else if(msg.redirect) {
        location.href = msg.redirect;
    }
    else if(msg.user) {
        location.reload()
    }
}