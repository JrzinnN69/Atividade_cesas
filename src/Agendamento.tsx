import { useState, useEffect } from 'react';
import { Horarios } from './Horarios';
import { Resumo } from './Resumo';
import { Search, Waves, Dumbbell , Volleyball } from 'lucide-react';
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

      setStep('select-resource');
      setSelectedResource(null);
      setSelectedSlot(null);
      setDescription('');

      onNavigate('my-reservations');
    }
  };

  const handleBackToTime = () => {
    setStep('select-time');
    setSelectedSlot(null);
  };

  const renderBreadcrumb = () => {
    if (step === 'select-resource') return <>Início &gt; Nova Reserva</>;
    if (step === 'select-time' && selectedResource)
      return <>Início &gt; Nova Reserva &gt; {selectedResource.name}</>;
    if (step === 'summary' && selectedResource)
      return <>Início &gt; Nova Reserva &gt; {selectedResource.name} &gt; Confirmação</>;
    return null;
  };

  const getResourceIcon = (icon: Resource['icon']) => {
    switch (icon) {
      case 'quadra':
        return <Volleyball size={80} color=" #00E5C7" />;
      case 'campo':
        return <Dumbbell size={80} color=" #00E5C7"/>;
      case 'piscina':
        return <Waves size={80} color="#00E5C7" />;
      default:
        return null;
    }
  };

  return (
    <div className="container fs-6 py-4">
      {/* Breadcrumb */}
      <div className="mb-3" style={{ color: '#437D7B', fontWeight: 500 }}>
        {renderBreadcrumb()}
      </div>

      {/* Seleção de recurso */}
      {step === 'select-resource' && (
        <>
          <h2 className="fs-3 mb-3">Escolha o Espaço</h2>

          <div
            className="card flex-row align-items-center gap-3 mb-3 p-3 border-secondary-subtle"
            style={{ backgroundColor: 'rgba(242, 242, 242, 1)' }}
          >
            <h3 className="m-0 fw-light fs-6 text-muted">Busque um recurso</h3>
            <div className="input-group">
              <span className="input-group-text border-end-0 bg-white">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control ps-0 border-start-0 bg-white"
                placeholder="Buscar recurso"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-2 border-verde">
            <div
              className="border-bottom border-verde"
              style={{ backgroundColor: 'rgba(245, 255, 254, 1)' }}
            >
              <h3 className="m-0 fw-light p-3 fs-6" style={{ color: 'rgba(24, 122, 117, 1)' }}>
                Ou selecione o espaço que desejar
              </h3>
            </div>

            <div className="row g-4 p-4">
              {filteredResources.map(resource => (
                <div key={resource.id} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow-sm cursor-pointer"
                    onClick={() => handleResourceSelect(resource)}
                  >
                    <div className="card-body bg-verde-claro icone-verde d-flex flex-column align-items-center justify-content-center text-center gap-3 py-4">
                      {getResourceIcon(resource.icon)}
                    

                      <h5 className="fw-normal mb-0">{resource.name}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Horários */}
      {step === 'select-time' && selectedResource && (
        <Horarios
          selectedDate={selectedDate}
          selectedResource={selectedResource.name}
          selectedSlot={selectedSlot}
          onSlotSelect={handleSlotSelect}
        />
      )}

      {/* Resumo */}
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
