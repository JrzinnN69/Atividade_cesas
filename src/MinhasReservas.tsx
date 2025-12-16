import { useState } from 'react';
import { Search, XCircle, AlertCircle, Calendar, Clock, Filter } from 'lucide-react';

interface Reservation {
  id: string;
  resource: {
    name: string;
    category: string;
    image: string;
  };
  date: Date;
  slot: {
    time: string;
  };
  // REMOVIDA: description: string;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
}

interface MyReservationsPageProps {
  reservations: Reservation[];
  onNavigate: (screen: string) => void;
  onCancelReservation: (id: string) => void;
}

export function MinhasReservas({
  reservations,
  onNavigate,
  onCancelReservation,
}: MyReservationsPageProps) {
  const [activeTab, setActiveTab] = useState<'feitas' | 'todas'>('feitas');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  const filteredReservations = reservations.filter((reservation) => {
    if (activeTab === 'feitas' && reservation.status !== 'confirmed') return false;
    if (statusFilter !== 'todos' && reservation.status !== statusFilter) return false;
    if (searchQuery && !reservation.resource.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const formatDateLong = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const handleCancelClick = (id: string) => setShowCancelModal(id);
  const confirmCancel = () => {
    if (showCancelModal) {
      onCancelReservation(showCancelModal);
      setShowCancelModal(null);
    }
  };

  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;

  return (
    <div className="container py-4">
      {/* Header */}
      <h1 className="mb-4">Minhas Reservas</h1>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body row g-3">
          <div className="col-md-3">
            <label className="form-label small">Estado</label>
            <div className="input-group">
              <span className="input-group-text"><Filter size={16} /></span>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="confirmed">Confirmadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label small">Data</label>
            <select className="form-select">
              <option value="todos">Todas</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small">Horário</label>
            <select className="form-select">
              <option value="todos">Todos</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small">Buscar</label>
            <div className="input-group">
              <span className="input-group-text"><Search size={16} /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Nome do espaço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'feitas' ? 'active' : ''}`}
            onClick={() => setActiveTab('feitas')}
          >
            Reservas Feitas <span className="badge bg-success ms-1">{confirmedCount}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'todas' ? 'active' : ''}`}
            onClick={() => setActiveTab('todas')}
          >
            Todas as Reservas <span className="badge bg-secondary ms-1">{reservations.length}</span>
          </button>
        </li>
      </ul>

      {/* Reservation Cards */}
      {filteredReservations.length === 0 ? (
        <div className="card text-center p-5">
          <div className="mb-3 d-flex justify-content-center">
            <Calendar size={40} className="text-secondary" />
          </div>
          <button className="btn btn-success" onClick={() => onNavigate('booking')}>
            Fazer Nova Reserva
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <img src={reservation.resource.image} className="card-img-top" alt={reservation.resource.name} />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{reservation.resource.name}</h5>
                    <span className={`badge ${reservation.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>
                      {reservation.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                    </span>
                  </div>
                  <p className="text-muted small mb-2">{reservation.resource.category}</p>

                  <div className="mb-2">
                    <div className="d-flex align-items-center gap-2 small text-muted">
                      <Calendar size={16} className="text-success" /> <span>{formatDateLong(reservation.date)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 small text-muted">
                      <Clock size={16} className="text-success" /> <span>{reservation.slot.time}</span>
                    </div>
                  </div>

                  {reservation.status === 'confirmed' && (
                    <button
                      className="btn btn-outline-danger mt-auto"
                      onClick={() => handleCancelClick(reservation.id)}
                    >
                      <XCircle size={16} className="me-1" /> Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancelar Reserva</h5>
                <button type="button" className="btn-close" onClick={() => setShowCancelModal(null)}></button>
              </div>
              <div className="modal-body text-center">
                <AlertCircle size={40} className="text-danger mb-3" />
                <p>Tem certeza? Esta ação não pode ser desfeita.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowCancelModal(null)}>Voltar</button>
                <button className="btn btn-danger" onClick={confirmCancel}>Sim, Cancelar Reserva</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}