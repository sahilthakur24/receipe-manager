import { useState, useEffect } from "react";
import '../styles/App.css';
import Section from './Section';
import AddRecipeForm from "./AddRecipeForm";
import RecipeList from "./RecipeList";


function App() {
  // Liste des recettes
  const [recipes, setRecipes] = useState([]);
  // view: 'home' | 'add' | 'list'
  const [view, setView] = useState('home');

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
      setView('list');
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

  // Navigation helpers
  const goHome = () => setView('home');
  const goAdd = () => setView('add');
  const goList = () => setView('list');

  return (
    <div className="App">
      {view === 'home' && (
        <Section id='home' title='Recipe Manager'>
          <img src="/home-bg.jpg" alt="background" className="home-bg-img" />
          <div className="home-overlay">
            <div style={{display: 'flex', gap: '12px'}}>
              <button onClick={goAdd}>Add Recipe</button>
              <button onClick={goList}>View Recipes</button>
            </div>
          </div>
        </Section>
      )}

      {view === 'add' && (
        <Section id='recipes-form' title='Add Recipe'>
          <AddRecipeForm onNewRecipe={addRecipe} />
          <div style={{marginTop: 12}}>
            <button onClick={goList}>View Recipes &gt;</button>
            <button onClick={goHome} style={{marginLeft:8}}>&lt; Home</button>
          </div>
        </Section>
      )}

      {view === 'list' && (
        <Section id='recipes-container' title={ recipes.length ? 'My recipes' : '' }>
          <RecipeList data={recipes} onDeleteRecipe={deleteRecipe} />
          <div style={{marginTop: 12}}>
            <button onClick={goAdd}>+ Add Recipe</button>
            <button onClick={goHome} style={{marginLeft:8}}>&lt; Home</button>
          </div>
        </Section>
      )}
    </div>
  );
}

export default App;
