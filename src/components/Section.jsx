/* eslint-disable react/prop-types */
import '../styles/Section.css';

const Section = ({ id, title, children }) => {
  return (
    <section id={id}>
        <h1 className='title'>{title}</h1>
        {children}
    </section>
  )
}

export default Section;