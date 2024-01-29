const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const resultsHeading = document.getElementById('results-heading');
const singleMealEl = document.getElementById('single-meal');
const mealsEl = document.getElementById('meals');

const submitMeal = (e) => {
	e.preventDefault();

	// Clear single meal
	singleMealEl.innerHTML = '';

	// Get search term
	const term = search.value;
	console.log(term);

	// Check for empty
	if (term.trim()) {
		let searchByTermStr = `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`;
		fetch(searchByTermStr)
			.then((r) => {
				return r.json();
			})
			.then((d) => {
				// resultsHeading.innerHTML = `<h2>Search results for ${term}</h2>`;

				if (d.meals === null) {
					resultsHeading.innerHTML =
						'<p>There are no results for this search, please try something else.</p>';
				} else {
					mealsEl.innerHTML = d.meals
						.map((i, k) => {
							return `
                        <div class="meal" >
                            <img src="${i.strMealThumb}" class="" alt="${i.strMeal}" />
                            <div class="meal-info" data-mealid="${i.idMeal}">
                                <h3>${i.strMeal}</h3>
                            </div>
                        </div>
                    `;
						})
						.join('');
				}
			});
		// Clear seach text
		search.value = '';
	} else {
		alert('Please enter a search term');
	}
};

const getMealById = (mealId) => {
	let searchByIdStr = `https://themealdb.com/api/json/v1/1/lookup.php?i=${mealId}
`;

	fetch(searchByIdStr)
		.then((r) => r.json())
		.then((d) => {
			console.log(d);

			const meal = d.meals[0];
			addMealToDOM(meal);
		});
};

const getRandomMeal = () => {
	// Clear meals and elements
	mealsEl ? (mealsEl.innerHTML = '') : '';
	resultsHeading ? (resultsHeading.innerHTML = '') : '';

	fetch(`https://themealdb.com/api/json/v1/1/random.php
`)
		.then((r) => r.json())
		.then((d) => {
			const meal = d.meals[0];
			console.log(d);
			addMealToDOM(meal);
		});
};

const addMealToDOM = (meal) => {
	console.log(meal);
	const ingredients = [];

	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`]) {
			ingredients.push(
				`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
			);
		} else {
			break;
		}
	}

	singleMealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory && `<p>${meal.strCategory}</p>`}
                ${meal.strArea && `<p>${meal.strArea}</p>`}
            </div>
            <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map((i) => `<li>${i}</li>`).join('')}
            </ul>
            </div>
        </div>
    `;
};

submit.addEventListener('submit', submitMeal);

mealsEl.addEventListener('click', (e) => {
	let mealId;
	const path = e.composedPath();

	path.forEach((i) => {
		if (i.classList) {
			if (i.classList.contains('meal-info')) {
				console.log(i.getAttribute('data-mealid'), 'item');
				mealId = i.getAttribute('data-mealid');
				return true;
			}
		} else {
			return false;
		}
	});

	if (mealId) {
		getMealById(mealId);
	}
});

random.addEventListener('click', getRandomMeal);
