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
      <h1 className="mb-4 fs-3">Minhas Reservas</h1>
      {/* Filters Card */}
      <div className="mb-4">
        {/* Título "Filtros" com fundo cinza-claro e largura ajustada */}
        <h5 className="d-inline-block fs-6 mb-0 text-muted p-3 pt-2 pb-1 bg-cinza-claro rounded-top">
          Filtros
        </h5>

        <div className="d-flex flex-row bg-cinza-claro ggg g-3">
          {/* Estado */}
          <div className="largura p-3">
            <label className="form-label text-muted small mb-1">Estado</label>
            <select
              className="form-select text-muted "
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="confirmed">Confirmadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          {/* Data */}
          <div className="largura p-3">
            <label className="form-label text-muted small mb-1">Data</label>
            <select className="form-select text-muted">
              <option value="todos" className='text-muted'>Todas</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
            </select>
          </div>

          {/* Horário */}
          <div className="largura p-3">
            <label className="form-label text-muted small mb-1">Horário</label>
            <select className="form-select text-muted ">
              <option value="todos">Todos</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>
          </div>

          {/* Buscar */}
          <div className="largura p-3">
            <label className="form-label text-muted small mb-1">Buscar</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0 text-muted "
                placeholder="Nome do espaço"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Botão Enviar */}
          <div className="p-3 d-flex align-items-end">
            <button className="btn rounded-pill bg-cinza-escuro px-4">
              Enviar
            </button>
          </div>

        </div>
      </div>



      
        {/* Tabs */}
        <ul className="nav nav-tabs m-0">
          <li className="nav-item me-2"> {/* me-2 adiciona margem à direita */}
            <button
              className={`nav-link ${activeTab === 'feitas' ? 'active' : 'not-active'}`}
              onClick={() => setActiveTab('feitas')}
            >
              Reservas ativas <span className="badge bg-success rounded-pill align-middle text-center  ms-1">{confirmedCount}</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'todas' ? 'active' : 'not-active'}`}
              onClick={() => setActiveTab('todas')}
            >
              Todas as reservas <span className="badge bg-success rounded-pill align-middle text-center ms-1">{reservations.length}</span>
            </button>
          </li>
        </ul>
        <div className='border border-top-0 p-4'>
        {/* Reservation Cards */}
        {filteredReservations.length === 0 ? (
            <button className="btn btn-success w-max" onClick={() => onNavigate('booking')}>
              Fazer Nova Reserva
            </button>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filteredReservations.map((reservation) => (
              <div key={reservation.id} className=" ">
                <div className="card m-0 p-4 pt-0">
                  <div className='d-flex flex-row justify-content-between'>
                      <span className={` badge ${reservation.status === 'confirmed' ? 'azul-claro' : 'vermelho-claro'} hh fw-normal p-2`}>
                        {reservation.status === 'confirmed' ? 'Reservado' : 'Cancelada'}
                      </span>
                      {reservation.status === 'confirmed' && (
                          <button
                            className="btn cancelar rounded-pill mt-4"
                            onClick={() => handleCancelClick(reservation.id)}
                          >
                            Cancelar Reserva
                          </button>
                        )}
                    </div>

                  <div className="card-body ps-0 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{reservation.resource.name}</h5>
                      
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

                    
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}
        </div>

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