const url = 'https://randomuser.me/api/?results=12&inc=picture,name,email,location,dob,cell&nat=gb,us';
const gallery = document.querySelector('#gallery') ;
const body = document.querySelector('body');
const nameSearch = document.getElementById('search-input');
const searchButton = document.getElementById('search-submit');
var employeeList = [] ;
var lastIndex = 0 ;

//Generate the employee cards and add to the page.
function generateCard(empData) {
    const card = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${empData.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${empData.name.first} ${empData.name.last}</h3>
                <p class="card-text">${empData.email}</p>
                <p class="card-text cap">${empData.location.city}, ${empData.location.state}</p>
            </div> 
        </div>   
        `;
    gallery.insertAdjacentHTML('beforeend',card);
}


/**
 * set Date format to MM/DD/YYYY
 * @param {string} date - A date string param.
 * @returns {string}  return date string in MM/DD/YYYY format
 */
function getDate(date) {
    const day = date.split('-')[2].substring(0,2);
    const month = date.split('-')[1];
    const year = date.split('-')[0];
    const dob = month+'/'+day+'/'+year ;
    return dob ;

}

//Generate Employee Model window
function generateEmpModel(index) {
    const empData = employeeList[index];
    const empdDob = getDate(empData.dob.date);
    const modelCard = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${empData.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${empData.name.first} ${empData.name.last}</h3>
                <p class="modal-text">${empData.email}</p>
                <p class="modal-text cap">${empData.location.city}</p>
                <hr>
                <p class="modal-text">${empData.cell}</p>
                <p class="modal-text">${empData.location.street.number} ${empData.location.street.name}, 
                ${empData.location.state}, ${empData.location.country} ${empData.location.postcode}</p>
                <p class="modal-text">Birthday: ${empdDob}</p>
            </div>
        </div>        
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    `;
    body.insertAdjacentHTML('beforeend',modelCard);
    const closeButton = document.querySelector('#modal-close-btn');
    const model = document.querySelector('.modal-container');
    const prevButton = document.querySelector('#modal-prev');
    const nextButton = document.querySelector('#modal-next');

    closeButton.addEventListener('click', e=> {
        model.remove();
    });

    prevButton.addEventListener('click', e=> {
        if (index > 0) {
            model.remove();
            generateEmpModel(index-1);
        }
    });
    nextButton.addEventListener('click', e=> {
        if (index < employeeList.length-1) {
            model.remove();
            generateEmpModel(index+1);
        }
    });



}

//Find a employee information that are already in the Page.

function findEmployee(element) {
    let name  = element ;
    if (element.className !== 'card-name cap') {     
        name = element.querySelector('.card-name');
    }
    for (let i = 0; i < employeeList.length;i++ ) {
        const empName = employeeList[i].name.first+' '+employeeList[i].name.last;
        if (name.textContent === empName) {
            generateEmpModel(i);
            break;
        }
    }

}

// ------------------------------------------
//  FETCH Data
// ------------------------------------------

fetch(url)
.then(res => res.json())
.then(data => {
    employeeList = data.results;
    employeeList.forEach(card => {        
        generateCard(card) ;

    });
})
.catch( error => console.log('Looks like ther was a problem!',error))


// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
gallery.addEventListener('click', e => {
    const target = e.target.className;
    if ( target === 'card') {
        findEmployee(e.target);

    } else if (target === 'card-img-container') {
        findEmployee(e.target.parentElement);

    } else if (target === 'card-img') {
        findEmployee(e.target.parentElement.parentElement);

    } else if (target === 'card-info-container') {
        findEmployee(e.target.parentElement);

    } else if (target === 'card-name cap') {
        console.log('card-name cap loop')
        findEmployee(e.target);
    } else if (target === 'card-text') {
        findEmployee(e.target.parentElement.parentElement);

    } else if (target === 'card-text cap') {
        findEmployee(e.target.parentElement.parentElement);

    }
});

searchButton.addEventListener('click',e => {
    let searchText = nameSearch.value.toLowerCase() ;
    let employees = document.querySelectorAll('h3#name');
    employees.forEach( employee => {
        if (employee.textContent.toLowerCase().includes(searchText)) {
            employee.parentNode.parentNode.style.display = 'block';

        } else {
            employee.parentNode.parentNode.style.display = 'none';
        }

    });
});














