import React, { useState, useEffect } from "react";
import recipesData from './RecipeList'; // Renamed to avoid confusion
import './App.css';  // Import the CSS file

function App() {
  // Load recipes from localStorage or use default recipesData
  const [recipes, setRecipes] = useState(() => {
    const storedRecipes = localStorage.getItem('recipes');
    return storedRecipes ? JSON.parse(storedRecipes) : recipesData;
  });
  
  const [ingre, setIngre] = useState([]);
//Effects needed to be prformed
  useEffect(() => {
    // Save recipes to localStorage whenever they change
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  function handleClick(id) {
    if (ingre.length > 0 && ingre[0].id === id) {
      setIngre([]);
    } else {
      setIngre(recipes.filter(ls => ls.id === id));
    }
  }

  function handleCheckClick(event, ingredientId, recipeId) {
    event.stopPropagation();

    // Update the recipes state to toggle the availability status
    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        return {
          ...recipe,
          ingredients: recipe.ingredients.map(ingredient =>
            ingredient.id === ingredientId
              ? { ...ingredient, isAvailable: !ingredient.isAvailable }  // Toggle isAvailable
              : ingredient
          )
        };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);  // Update the global state
    setIngre(updatedRecipes.filter(ls => ls.id === recipeId));  // Update the selected recipe
  }

  const Item = recipes.map(ele => {
    // Check if all ingredients are available
    const allIngredientsAvailable = ele.ingredients.every(ing => ing.isAvailable);

    return (
      <tr 
        key={ele.id} 
        onClick={() => handleClick(ele.id)} 
        className={`recipe-row ${allIngredientsAvailable ? 'highlighted-recipe' : ''}`}  // Add highlight if all ingredients are available
      >
        <td className="recipe-name">
          {ele.name}
          {ingre.map(ls => {
            if (ele.id === ls.id) {
              return (
                <ul className="ingredient-list">
                  {ls.ingredients.map((ing) =>
                    <div key={ing.name}>
                      <li className="ingredient-item">{ing.name}
                        <input 
                          onClick={(event) => handleCheckClick(event, ing.id, ele.id)} 
                          type="checkbox" 
                          checked={ing.isAvailable || false}  // Ensure checkbox reflects correct status
                        />
                      </li>
                    </div>
                  )}
                </ul>
              );
            }
            return null;
          })}
        </td>
      </tr>
    );
  });

  return (
    <div className="app-container">
      <center><h1 className="app-title">CookBook Vault</h1></center>
      <table className="recipe-table">
        <tbody>
          {Item}
        </tbody>
      </table>
    </div>
  );
}

export default App;
