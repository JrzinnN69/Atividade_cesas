import { useState } from 'react';

interface Resource {
  id: string;
  name: string;
  category: string;
  image: string;
  sportType?: string;
  resourceType?: string;
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
  
  const canConfirm = userName.trim() !== '' && description.trim().length >= 5;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatDateLong = (date: Date) =>
    date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="row g-4">
      {/* Main Form */}
      <div className="">
        <h2 className='fs-2 mb-4'>Confirmação da reserva</h2>
      <div className='border rounded-2 border-verde'>
        <div className='border-bottom border-verde'style={{ backgroundColor: 'rgba(245, 255, 254, 1)' }}>
            <h3 className='m-0 fw-light p-3'style={{ color: 'rgba(24, 122, 117, 1)' }}>Confira os campos abaixo para prosseguir com sua reserva:</h3>
        </div>
          <div className="card p-4 border-0">
            <div className="card-header border-0 bg-cinza">
              <h5 className="mb-1">Informações do seu Agendamento</h5>
            </div>

            <div className="card-body p-0 ">
              {/* Nome Completo */}
              <div className="mt-0 d-flex align-items-start border-bottom bg-cinza-claro">
                <label className="form-label mt-2 col-2 text-end pe-2">
                  <span className="text-danger">*</span> Nome Completo
                </label>
                <div className="my-2 pe-3 col-10">
                  <input
                    type="text"
                    className="form-control w-100"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Digite seu nome completo"
                  />
                </div>
              </div>

              {/* Data da Reserva */}
              <div className="mt-0 d-flex align-items-start border-bottom bg-cinza-claro">
                <label className="form-label mt-2 col-2 text-end pe-2">Data da Reserva</label>
                <div className="my-2 pe-3 col-10">
                  <input type="text" className="form-control" value={formatDate(selectedDate)} readOnly />
                </div>
              </div>

              {/* Horário */}
              <div className="mt-0 d-flex align-items-start border-bottom bg-cinza-claro">
                <label className="form-label mt-2 col-2 text-end pe-2">Horário</label>
                <div className="my-2 pe-3 col-10">
                  <input type="text" className="form-control" value={selectedSlot.time} readOnly />
                </div>
              </div>

              {/* Espaço */}
              <div className="mt-0 d-flex align-items-start border-bottom bg-cinza-claro">
                <label className="form-label mt-2 col-2 text-end pe-2">Espaço</label>
                <div className="my-2 pe-3 col-10">
                  <input
                    type="text"
                    className="form-control"
                    value={`${selectedResource.name} - ${selectedResource.category}`}
                    readOnly
                  />
                </div>
              </div>

              {/* Descrição da Atividade */}
              <div className="mt-0 d-flex align-items-start border-bottom rounded-bottom bg-cinza-claro">
                <label className="form-label mt-2 col-2 text-end pe-2">
                  <span className="text-danger">*</span>Descrição da Atividade 
                </label>
                <div className="my-2 pe-3 col-10">
                  <textarea
                    className="form-control"
                    rows={4}
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="Descreva o objetivo da reserva"
                  />
                  <small className="form-text text-muted">Mínimo 5 caracteres ({description.length}/5)</small>
                </div>
              </div>

            
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2 bg-white mt-3 border-0">
              <button className="btn bg-cinza-escuro rounded-pill fw-bold" onClick={onBack}>
                Voltar
              </button>
              <button className="btn selecionado fw-bold rounded-pill text-white" onClick={onConfirm} disabled={!canConfirm}>
                Confirmar Reserva
              </button>
            </div>
      </div>
      
      
    </div>
  );
}
