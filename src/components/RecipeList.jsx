/* eslint-disable react/prop-types */
import Recipe from './Recipe';
import '../styles/RecipeList.css';

const RecipeList = ({ data = [], onDeleteRecipe = f => f }) => {
    if (!data.length) return <div className='no-recipe'>No recipes available</div>
    return (
        <div className="recipe-list">
            {
                data.map((recipe, index) => {
                    const key = recipe && recipe.id ? recipe.id : index;
                    const idOrIndex = recipe && recipe.id ? recipe.id : index;
                    return (
                        <Recipe key={key} data={recipe} onDelete={() => onDeleteRecipe(idOrIndex)} />
                    )
                })
            }
        </div>
    )
}

export default RecipeList;