// Global app controller
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView'
import Search from './models/search';
import Recipe from './models/Recipe';

//global state of app
/*
*- Search Object
*- Current Recipe Object
*- Shopping List Object
*- Liked Recipes
*/
const state = {};

// SEARCH CONTROLLER

const controlSearch = async () => {
    // 1- Get query from view
    const query = searchView.getInput();// to do
    if (query) {
        // 2 - new search object and add to state
        state.search = new Search(query);

        // 3 - prepare UI for results
        await searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
        // 4 - search for recipes
        await state.search.getResults();

        // 5- render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        console.log(state);

        } catch (err) {
            console.log(`something went wrong ${err}`);
            clearLoader();
        }
        
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        searchView.clearResults();
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.renderResults(state.search.result, goToPage);

        
    }
});




// RECIPE CONTROLLER
const controlRecipe = async () => {

    // gets id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // prepare ui for changes

        // create new recipe object
        state.recipe = new Recipe (id);

        try {
        // get recipe data 
        await state.recipe.getRecipe();
        // parse ingredients 
        state.recipe.parseIngredients();
        // cal servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        // render recipe
        console.log(state.recipe);
        } catch (err) {
            console.log(`Sorry something went wrong ${err}`);
        }
      
    }
}


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));













