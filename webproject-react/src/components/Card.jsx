import { Button } from './Button';

export function Card({ title, author, category, onOpen }) {
  return (
    <article className="card">
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <p className="card__author">{author}</p>
        <span className="card__category">{category}</span>
      </div>
      <div className="card__actions">
        <Button onClick={onOpen}>Детальніше</Button>
      </div>
    </article>
  );
}