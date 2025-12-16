import { useState, useEffect } from 'react';
import { Horarios } from './Horarios';
import { Resumo } from './Resumo';
import { Navegacao } from './Navegacao';
import { Search } from 'lucide-react';
import { Resource, TimeSlot, Screen } from './types';

interface NewReservationData {
  resource: Resource;
  date: Date;
  slot: TimeSlot;
  description: string;
}

interface BookingPageProps {
  resources: Resource[];
  preSelectedResourceId?: string;
  onNavigate: (screen: Screen) => void;
  onReservationComplete: (reservation: NewReservationData) => void;
}

export function Agendamento({
  resources,
  preSelectedResourceId,
  onNavigate,
  onReservationComplete,
}: BookingPageProps) {
  const [step, setStep] = useState<'select-resource' | 'select-time' | 'summary'>('select-resource');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (preSelectedResourceId) {
      const resource = resources.find(r => r.id === preSelectedResourceId);
      if (resource) {
        setSelectedResource(resource);
        setStep('select-time');
      }
    }
  }, [preSelectedResourceId, resources]);

  const filteredResources = resources.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResourceSelect = (resource: Resource) => {
    setSelectedResource(resource);
    setSelectedSlot(null);
    setStep('select-time');
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('summary');
  };

  const handleConfirmReservation = () => {
    if (selectedResource && selectedSlot) {
      onReservationComplete({
        resource: selectedResource,
        date: selectedDate,
        slot: selectedSlot,
        description,
      });

      // Reset estado
      setStep('select-resource');
      setSelectedResource(null);
      setSelectedSlot(null);
      setDescription('');
      
      onNavigate('my-reservations');
    }
  };

  const handleBackToResources = () => {
    setStep('select-resource');
    setSelectedResource(null);
    setSelectedSlot(null);
  };

  const handleBackToTime = () => {
    setStep('select-time');
    setSelectedSlot(null);
  };

  const getBreadcrumbItems = () => {
    const items = [{ label: 'Início', onClick: () => onNavigate('home') }, { label: 'Nova Reserva' }];
    if (step === 'select-time' && selectedResource) {
      items.push({ label: selectedResource.name });
    } else if (step === 'summary' && selectedResource) {
      items.push({ label: selectedResource.name, onClick: handleBackToResources });
      items.push({ label: 'Confirmação' });
    }
    return items;
  };

  return (
    <div className="container py-4">
      {/* @ts-ignore */}
      <Navegacao items={getBreadcrumbItems()} />

      {step === 'select-resource' && (
        <>
          <h2 className="h5 mb-3">Escolha o Espaço</h2>
          <div className="card mb-3 p-3">
            <div className="input-group">
              <span className="input-group-text"><Search size={16} /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar recurso..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="row g-4">
            {filteredResources.map(resource => (
              <div key={resource.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm cursor-pointer" style={{cursor: 'pointer'}} onClick={() => handleResourceSelect(resource)}>
                  <img src={resource.image} alt={resource.name} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-success">{resource.category}</span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{resource.name}</h5>
                    <button className="btn btn-success mt-auto">Selecionar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 'select-time' && selectedResource && (
        <Horarios
          selectedDate={selectedDate}
          selectedResource={selectedResource.name}
          selectedSlot={selectedSlot}
          onSlotSelect={handleSlotSelect}
        />
      )}

      {step === 'summary' && selectedResource && selectedSlot && (
        <Resumo
          selectedResource={selectedResource}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          description={description}
          onDescriptionChange={setDescription}
          onConfirm={handleConfirmReservation}
          onBack={handleBackToTime}
        />
      )}
    </div>
  );
}
