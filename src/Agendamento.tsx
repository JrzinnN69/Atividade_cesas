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

  const renderBreadcrumb = () => {
    if (step === 'select-resource') return <>Início &gt; Nova Reserva</>;
    if (step === 'select-time' && selectedResource) return <>Início &gt; Nova Reserva &gt; {selectedResource.name}</>;
    if (step === 'summary' && selectedResource && selectedSlot) return <>Início &gt; Nova Reserva &gt; {selectedResource.name} &gt; Confirmação</>;
    return null;
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
    <div className="container fs-6 py-4">
      {/* Breadcrumb simples */}
      <div className="mb-3 " style={{ color: '#437D7B', fontWeight: 500 }}>
        {renderBreadcrumb()}
      </div>

      {/* Step 1: Select Resource */}
      {step === 'select-resource' && (
        <>
          <h2 className="h5 mb-3">Escolha o Espaço</h2>
          <div className="card flex-row mb-3 p-3 border-secondary-subtle" style={{ backgroundColor: 'rgba(242, 242, 242, 1)' }}>
            <h3 className='m-0 fw-light' style={{ color: 'rgba(102, 105, 137, 1)' }}>Busque um recurso</h3>
            <div className="input-group">
              <span className="input-group-text border-end-0 bg-white"><Search size={16} /></span>
              <input
                type="text"
                className="form-control ps-0 border-start-0 bg-white"
                placeholder="Buscar recurso"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='border rounded-2 border-verde'>

            <div className='border-bottom border-verde'style={{ backgroundColor: 'rgba(245, 255, 254, 1)' }}>
              <h3 className='m-0 fw-light p-3'style={{ color: 'rgba(24, 122, 117, 1)' }}>Ou selecione o espaço que desejar</h3>
            </div>

            <div className="row g-4 p-4">
              {filteredResources.map(resource => (
                <div key={resource.id} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow-sm cursor-pointer position-relative text-white"
                    style={{ cursor: 'pointer', overflow: 'hidden' }}
                    onClick={() => handleResourceSelect(resource)}
                  >
                    <img
                      src={resource.image}
                      alt={resource.name}
                      className="card-img-top"
                      style={{ height: '180px', objectFit: 'cover', filter: 'brightness(0.6)' }} // escurece a imagem para o texto aparecer
                    />

                    {/* Nome centralizado sobre a imagem */}
                    <div
                      className="position-absolute top-50 start-50 translate-middle text-center"
                      style={{ pointerEvents: 'none' }}
                    >
                      <h5 className="mb-0 fw-bold fs-2">{resource.name}</h5>
                    </div>

                    {/* Badge de categoria */}
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-success">{resource.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
