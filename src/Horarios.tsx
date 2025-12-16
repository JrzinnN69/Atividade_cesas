import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Adicionados ícones para navegação, caso queira implementar

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeGridProps {
  selectedDate: Date;
  selectedResource: string;
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
}

interface Booking {
  dayIndex: number; // 0=Segunda, 6=Domingo, correspondente ao índice da coluna da tabela
  timeSlot: string;
  user: string;
}

export function Horarios({ selectedDate, selectedResource, selectedSlot, onSlotSelect }: TimeGridProps) {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [selectedCell, setSelectedCell] = useState<{ day: number; time: string } | null>(null);

  // Função para obter a semana a partir de uma data (começando na Segunda-feira)
  const getWeekDates = (date: Date) => {
    const week = [];
    const current = new Date(date);
    const day = current.getDay(); // 0 (Dom) a 6 (Sáb)
    // Calcula a diferença para Segunda-feira (1)
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    current.setDate(diff);
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);
  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const timeSlots = [
    '07:00', '07:45', '08:30', '09:15', '10:00', '10:45', '11:30', '12:15',
    '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15', '19:00'
  ];

  // Dados de exemplo de reservas (0=Segunda, 6=Domingo)
  const existingBookings: Booking[] = [
    { dayIndex: 1, timeSlot: '08:30', user: 'Paula Yuri' }, // Terça
    { dayIndex: 2, timeSlot: '10:00', user: 'Luane Andrade' }, // Quarta
    { dayIndex: 4, timeSlot: '13:00', user: 'Alice Pereira' }, // Sexta
  ];

  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6; // 0=Dom, 6=Sáb
  const isBooked = (dayIndex: number, timeSlot: string) =>
    existingBookings.some(b => b.dayIndex === dayIndex && b.timeSlot === timeSlot);

  const handleCellClick = (dayIndex: number, timeSlot: string) => {
    if (isWeekend(weekDates[dayIndex]) || isBooked(dayIndex, timeSlot)) return;
    setSelectedCell({ day: dayIndex, time: timeSlot });
  };

  const handleConfirmSelection = () => {
    if (selectedCell) onSlotSelect({ time: selectedCell.time, available: true });
    // Opcional: Voltar ao estado inicial após confirmação
    setSelectedCell(null); 
  };

  const monthYear = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="card mb-3 p-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <h5 className="text-capitalize mb-2 mb-md-0">{monthYear}</h5>
          <div className="btn-group" role="group">
            <button
              className={`btn ${view === 'week' ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setView('week')}
            >
              Semana
            </button>
            <button
              // O botão de Mês está aqui, mas a implementação da visualização está pendente.
              className={`btn ${view === 'month' ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setView('month')}
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      {/* Time Grid */}
      {view === 'week' && (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Horário</th>
                {dayNames.map((day, i) => (
                  <th key={i} className=''>
                    {day}<br />
                    <small className="text-muted fs-4">{weekDates[i].getDate()}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <th scope="row">{time}</th>
                  {weekDates.map((date, idx) => {
                    const weekend = isWeekend(date);
                    const booked = isBooked(idx, time);
                    const selected = selectedCell?.day === idx && selectedCell?.time === time;

                    let className = "cursor-pointer";
                    let text = "";

                    if (weekend) className = "celula bg-light text-muted";
                    else if (booked) {
                        // Estilo Ocupado
                        className = "celula ocupado cursor-not-allowed";
                        text="Reservado";
                    }
                    else if (selected) className = "selecionado";
                    else {
                        // Estilo Disponível (verde implícito pela falta de classe)
                        className = "celula cursor-pointer";
                    }

                    return (
                      <td 
                        key={idx} 
                        className={className} 
                        onClick={() => handleCellClick(idx, time)}
                        // Adicionado um título para acessibilidade/informação sobre a reserva
                        title={booked ? `Reservado por ${existingBookings.find(b => b.dayIndex === idx && b.timeSlot === time)?.user}` : (weekend ? 'Fim de semana' : 'Disponível')}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Visualização de Mês (pendente de implementação) */}
      {view === 'month' && (
          <div className="card p-5 text-center">
              <p className="text-muted">Visualização mensal de horários não implementada. Por favor, use a visualização semanal.</p>
          </div>
      )}

      {/* Confirm Button */}
      {selectedCell && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
            <button className="btn btn-success" onClick={handleConfirmSelection}>
              Confirmar
            </button>
        </div>
      )}
    </div>
  );
}