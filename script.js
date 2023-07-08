//  It will check if the favorites meal array exists in local storage, create it if not
if (!localStorage.getItem("favouritesList")) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}

//  This will fetch meals from the API and return the data
async function fetchMealsFromApi(url, value) {
  const response = await fetch(`${url}${value}`);
  const meals = await response.json();
  return meals;
}

//  This function is used to display all meal cards in the main section based on the search input value
function showMealList() {
  const inputValue = document.getElementById("my-search").value;
  const arr = JSON.parse(localStorage.getItem("favouritesList"));
  const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let html = "";

  fetchMealsFromApi(url, inputValue).then(data => {
    if (data.meals) {
      data.meals.forEach(element => {
        const isFav = arr.includes(element.idMeal);
        html += `
          <div id="card" class="card mb-3" style="width: 20rem;">
            <img src="${element.strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${element.strMeal}</h5>
              <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                <button id="main${element.idMeal}" class="btn btn-outline-light${isFav ? " active" : ""}" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%">
                  <i class="fa-solid fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      html += `
        <div class="page-wrap d-flex flex-row align-items-center">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-12 text-center">
                <span class="display-1 d-block">404</span>
                <div class="mb-4 lead">
                  The meal you are looking for was not found.
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    document.getElementById("main").innerHTML = html;
  });
}

//  This segement of code is used to display full meal details in the main section
async function showMealDetails(id) {
  const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";

  await fetchMealsFromApi(url, id).then(data => {
    html += `
      <div id="meal-details" class="mb-5">
        <div id="meal-header" class="d-flex justify-content-around flex-wrap">
          <div id="meal-thumbnail">
            <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
          </div>
          <div id="details">
            <h3>${data.meals[0].strMeal}</h3>
            <h6>Category: ${data.meals[0].strCategory}</h6>
            <h6>Area: ${data.meals[0].strArea}</h6>
          </div>
        </div>
        <div id="meal-instruction" class="mt-3">
          <h5 class="text-center">Instruction:</h5>
          <p>${data.meals[0].strInstructions}</p>
        </div>
      </div>
    `;
  });

  document.getElementById("main").innerHTML = html;
}

//  This will display all favorite meals in the favorites body
async function showFavMealList() {
  const arr = JSON.parse(localStorage.getItem("favouritesList"));
  const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";

  if (arr.length === 0) {
    html += `
      <div class="page-wrap d-flex flex-row align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-12 text-center">
              <span class="display-1 d-block">404</span>
              <div class="mb-4 lead">
                No meals added to your favorites list.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    for (let index = 0; index < arr.length; index++) {
      await fetchMealsFromApi(url, arr[index]).then(data => {
        html += `
          <div id="card" class="card mb-3" style="width: 20rem;">
            <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${data.meals[0].strMeal}</h5>
              <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%">
                  <i class="fa-solid fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }
  }

  document.getElementById("favourites-body").innerHTML = html;
}

//  Here we can add or remove meals from the favorites list
function addRemoveToFavList(id) {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let contain = arr.includes(id);

  if (contain) {
    const index = arr.indexOf(id);
    arr.splice(index, 1);
    alert("Your meal has been removed from your favorites list.");
  } else {
    arr.push(id);
    alert("Your meal has been added to your favorites list.");
  }

  localStorage.setItem("favouritesList", JSON.stringify(arr));
  showMealList();
  showFavMealList();
}
