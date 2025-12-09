import '../styles/Recipe.css';

/* eslint-disable react/prop-types */
const Recipe = ({ data = {}, onDelete = f => f }) => {
  return (
    <div className="Recipe">
      <button onClick={onDelete}>❌</button>
      <h3 className='title'>{data.title}</h3>
      <p className='description'>{data.description}</p>
      <fieldset>
        <legend>Ingredients</legend>
        <ul className='ingredients'>
          {
            data.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.trim()}</li>
            ))
          }
        </ul>
      </fieldset>
      <fieldset>
        <legend>Steps</legend>
        <ul className='steps'>
          {
            data.steps.filter(str => str.trim() != "").map((step, index) => (
              <li key={index}>{step.trim()}</li>
            ))
          }
        </ul>
      </fieldset>
    </div>
  )
}

export default Recipe;