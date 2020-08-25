import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            const recipedata = res.data.recipe;
            this.title = recipedata.title;
            this.author = recipedata.publisher;
            this.img = recipedata.image_url;
            this.url = recipedata.source_url;
            this.ingredients = recipedata.ingredients;
        } catch (error) {
            alert(`sum went wrong ${error}`);
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    };

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {

        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort = ['tbsp', 'tbsp','oz','oz','tbsp','tsp', 'tsp', 'cup', 'pound'];
        const newIngredients = this.ingredients.map(el => {
            // 1-uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });
            // 2-remove parenthesis 
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3-parse ingredients to count unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex  = arrIng.findIndex(el2 => unitsShort.includes(el2))
            let objIng;
            if (unitIndex > -1) {
                // there is a unit
                // ex 4 1/2 cups arrCount = [4, 1/2]
                // ex 4 cups arrCount = [4]
                const arrCount = arrIng.slice(0, unitIndex); 
                let count;

                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex +1).join(' ')
                };

            }else if (parseInt(arrIng[0],10)) {
                // no unit, but 1st elemnt is number
                objIng = { 
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if (unitIndex === -1) {
                // no unit and no number in first poistion
                objIng = { 
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng
        });
        this.ingredients = newIngredients;
    }
};