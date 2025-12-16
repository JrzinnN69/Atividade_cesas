import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Navegacao({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb bg-white p-3 rounded border">
        {items.map((item, index) => (
          <li
            key={index}
            className={`breadcrumb-item d-flex align-items-center ${index === items.length - 1 ? 'active' : ''}`}
            aria-current={index === items.length - 1 ? 'page' : undefined}
          >
            {/* Ícone Home no primeiro item */}
            {index === 0 && <Home size={16} className="me-2 text-success" />}

            {item.onClick && index !== items.length - 1 ? (
              <button
                type="button"
                className="btn btn-link p-0 text-success text-decoration-none"
                onClick={item.onClick}
              >
                {item.label}
              </button>
            ) : (
              <span className={index === items.length - 1 ? 'fw-bold' : ''}>
                {item.label}
              </span>
            )}

            {index < items.length - 1 && <ChevronRight size={16} className="ms-2 me-2 text-muted" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
