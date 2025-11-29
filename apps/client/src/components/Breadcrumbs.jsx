import { Link } from "react-router-dom";
import "../styles/Breadcrumbs.css";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs">
      <ol className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <Link to="/" className="breadcrumbs__link">
            Home
          </Link>
          <span className="breadcrumbs__separator">/</span>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="breadcrumbs__item">
              {item.to && !isLast ? (
                <>
                  <Link to={item.to} className="breadcrumbs__link">
                    {item.label}
                  </Link>
                  <span className="breadcrumbs__separator">/</span>
                </>
              ) : (
                <span className="breadcrumbs__current">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
