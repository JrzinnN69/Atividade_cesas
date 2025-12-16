import { useState } from 'react';

interface Resource {
  id: string;
  name: string;
  category: string;
  image: string;
  sportType: string;
  resourceType?: string; // Adicionado '?' para coincidir com o App.tsx
}

interface ResourcesPageProps {
  resources: Resource[];
  onNavigate: (screen: string, resourceId?: string) => void;
}

export function Recursos({ resources, onNavigate }: ResourcesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');

  const categories = ['Todos', 'Quadra', 'Campo', 'Piscina', 'Material'];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Adicionada verificação segura (resource.resourceType || '') caso venha undefined
    const matchesCategory = filterCategory === 'Todos' || (resource.resourceType || '') === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-4">

      {/* Page Header */}
      <div className="mb-3">
        <h1 className="h4 mb-1">Espaços e Materiais</h1>
        <p className="text-muted mb-3">Explore todos os recursos disponíveis no IFZN</p>
      </div>

      {/* Search & Filter */}
      <div className="card mb-3 p-3">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small">Buscar</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite o nome do recurso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small">Categoria</label>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-3">
        <span className="badge bg-light text-dark">
          {filteredResources.length} {filteredResources.length === 1 ? 'recurso' : 'recursos'}
        </span>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="card text-center p-5">
          <div className="mb-3">
            <span className="display-6 text-secondary">📍</span>
          </div>
          <h5 className="text-muted mb-1">Nenhum recurso encontrado</h5>
          <p className="text-muted small">Tente ajustar os filtros de busca</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm cursor-pointer"
                onClick={() => onNavigate('booking', resource.id)}
              >
                <img
                  src={resource.image}
                  alt={resource.name}
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-success">{resource.category}</span>
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{resource.name}</h5>                  
                  <button
                    className="btn text-white mt-auto"
                    style={{ backgroundColor: '#1FAD34' }}
                    onClick={(e) => {
                      e.stopPropagation(); // Evita ativar o onClick do card também
                      onNavigate('booking', resource.id);
                    }}
                  >
                    Fazer Reserva
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}