import { useState, useEffect } from "react";
import '../styles/App.css';
import Section from './Section';
import AddRecipeForm from "./AddRecipeForm";
import RecipeList from "./RecipeList";


function App() {
  // Liste des recettes
  const [recipes, setRecipes] = useState([]);

  // Load recipes from server on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('http://localhost:3000/api/recipes');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setRecipes(data);
      } catch (e) {
        // ignore fetch errors
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Ajouter une nouvelle recette (persist to server)
  const addRecipe = async (title, description, ingredients, steps) => {
    if (title.trim() === "" || description.trim() === "" || !Array.isArray(steps) || steps.length === 0) return;

    const payload = {
      title,
      description,
      ingredients: Array.isArray(ingredients) ? ingredients.filter(s => s.trim() !== '') : [],
      steps: Array.isArray(steps) ? steps.filter(s => s.trim() !== '') : []
    };

    try {
      const res = await fetch('http://localhost:3000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) return;
      const created = await res.json();
      setRecipes(prev => [...prev, created]);
      showRecipes();
    } catch (e) {
      // ignore
    }
  };

  // Supprimer une recette (server)
  const deleteRecipe = async indexOrId => {
    // indexOrId might be an index (number) or id (string). Prefer id if available.
    const id = typeof indexOrId === 'string' ? indexOrId : (recipes[indexOrId] && recipes[indexOrId].id);
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/recipes/${id}`, { method: 'DELETE' });
      if (res.status === 204) {
        setRecipes(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {
      // ignore
    }
  };

  // Afficher le formulaire
  const hideRecipes = () => {
    document.querySelector('#recipes-container').style.zIndex = 0;
    document.querySelector('#recipes-form').style.zIndex = 1;
  }

  // Afficher les recettes
  const showRecipes = () => {
    document.querySelector('#recipes-form').style.zIndex = 0;
    document.querySelector('#recipes-container').style.zIndex = 1;
  };

  return (
    <div className="App">
      <Section id='recipes-form' title='Receipe Manager'>
        <AddRecipeForm onNewRecipe={addRecipe} />
        <a onClick={showRecipes}>Recipes<span>&gt;</span></a>
      </Section>
      <Section id='recipes-container' title={ recipes.length ? 'My recipes' : '' }>
        <RecipeList data={recipes} onDeleteRecipe={deleteRecipe} />
        <a onClick={hideRecipes}><span>&lt;</span>Welcome</a>
      </Section>
    </div>
  );
}

export default App;
