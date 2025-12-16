import { useState } from 'react';
import { CheckCircle, Calendar, Clock, MapPin, User, FileText } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  category: string;
  image: string;
  // Propriedades removidas para compatibilidade com App.tsx:
  // capacity, description (do recurso), location
  sportType?: string;   // Tornado opcional por segurança
  resourceType?: string; // Tornado opcional por segurança
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingSummaryProps {
  selectedResource: Resource;
  selectedDate: Date;
  selectedSlot: TimeSlot;
  description: string;
  onDescriptionChange: (desc: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export function Resumo({
  selectedResource,
  selectedDate,
  selectedSlot,
  description,
  onDescriptionChange,
  onConfirm,
  onBack,
}: BookingSummaryProps) {
  const [userName, setUserName] = useState('João Silva');
  
  // CORREÇÃO: Ajustado para 5 caracteres para bater com o texto da UI (estava 10)
  const canConfirm = userName.trim() !== '' && description.trim().length >= 5;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatDateLong = (date: Date) =>
    date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="row g-4">
      {/* Main Form */}
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-1">Confirmação da Reserva</h5>
            <small className="text-muted">Revise os dados e confirme sua reserva</small>
          </div>

          <div className="card-body">
            {/* Alert */}
            <div className="alert alert-info d-flex align-items-center mb-4">
              <CheckCircle size={20} className="me-2" />
              Preencha todos os campos obrigatórios para confirmar a reserva
            </div>

            {/* Form */}
            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-2">
                <User size={16} />
                Nome Completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-2">
                <Calendar size={16} />
                Data da Reserva
              </label>
              <input type="text" className="form-control" value={formatDate(selectedDate)} readOnly />
            </div>

            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-2">
                <Clock size={16} />
                Horário
              </label>
              <input type="text" className="form-control" value={selectedSlot.time} readOnly />
            </div>

            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-2">
                <MapPin size={16} />
                Espaço
              </label>
              <input type="text" className="form-control" value={`${selectedResource.name} - ${selectedResource.category}`} readOnly />
            </div>

            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-2">
                <FileText size={16} />
                Descrição da Atividade <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={4}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Descreva o objetivo da reserva (ex: Aula de Voleibol Turma 301)"
              />
              <small className="form-text text-muted">Mínimo 5 caracteres ({description.length}/5)</small>
            </div>

            {!canConfirm && (
              <div className="alert alert-warning">
                ⚠️ Preencha o nome completo e a descrição da atividade (mínimo 5 caracteres)
              </div>
            )}
          </div>

          <div className="card-footer d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" onClick={onBack}>
              Voltar
            </button>
            <button className="btn btn-success" onClick={onConfirm} disabled={!canConfirm}>
              <CheckCircle size={18} className="me-1" />
              Confirmar Reserva
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-lg-4">
        <div className="card sticky-top" style={{ top: '20px' }}>
          <div className="card-header">
            <h6>Resumo</h6>
          </div>

          <div className="card-body">
            {/* Resource Image */}
            <div className="mb-3">
              <img
                src={selectedResource.image}
                alt={selectedResource.name}
                className="img-fluid rounded"
              />
            </div>

            <h6>{selectedResource.name}</h6>
            <span className="badge bg-success mb-3">{selectedResource.category}</span>

            <hr />

            <div className="mb-2">
              <div className="d-flex align-items-center gap-2 text-muted mb-1">
                <Calendar size={16} />
                <span>Data</span>
              </div>
              <div className="fw-bold">{formatDateLong(selectedDate)}</div>
            </div>

            <div className="mb-2">
              <div className="d-flex align-items-center gap-2 text-muted mb-1">
                <Clock size={16} />
                <span>Horário</span>
              </div>
              <div className="fw-bold">{selectedSlot.time}</div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}