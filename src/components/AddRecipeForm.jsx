/* eslint-disable react/prop-types */
import { useState } from 'react';
import '../styles/AddRecipeForm.css';

const AddRecipeForm = ({ onNewRecipe = f => f }) => {
    // Données de la recette en cours d'écriture
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);

    // Ajout d'une recette
    const submit = e => {
        e.preventDefault();
        onNewRecipe(title, description, ingredients, steps);
        setTitle(""); 
        setDescription("");
        setSteps([]);
        setIngredients([]);
    }
    
    return (
        <form>
            <label>Title: 
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Recipe name"
                />
            </label>
            
            <label>Description: 
                <textarea
                    className="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Recipe description"
                    rows={3}
                />
            </label>
            
            <label>Ingredients: 
                <textarea
                    className="ingredients"
                    value={ingredients.join("\n")}
                    onChange={e => setIngredients(e.target.value.split("\n"))}
                    placeholder="Ingredients for the recipe"
                    rows={5}
                />
            </label>
            
            <label>Steps: 
                <textarea
                    className="steps"
                    value={steps.join("\n")}
                    onChange={e => setSteps(e.target.value.split("\n"))}
                    placeholder="Recipe steps"
                    rows={5}
                />
            </label>
            
            <button onClick={submit}>Add</button>
        </form>
    )
}

export default AddRecipeForm;