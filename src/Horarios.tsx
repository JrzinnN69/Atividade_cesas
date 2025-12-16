import { useState } from 'react';

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
  dayIndex: number; // 0=Segunda, 6=Domingo
  timeSlot: string;
  user: string;
}

export function Horarios({ selectedDate, selectedResource, selectedSlot, onSlotSelect }: TimeGridProps) {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [selectedCell, setSelectedCell] = useState<{ day: number; time: string } | null>(null);

  const getWeekDates = (date: Date) => {
    const week = [];
    const current = new Date(date);
    const day = current.getDay();
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

  const existingBookings: Booking[] = [
    { dayIndex: 1, timeSlot: '08:30', user: 'Paula Yuri' },
    { dayIndex: 2, timeSlot: '10:00', user: 'Luane Andrade' },
    { dayIndex: 4, timeSlot: '13:00', user: 'Alice Pereira' },
  ];

  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const handleCellClick = (dayIndex: number, timeSlot: string) => {
    const weekend = isWeekend(weekDates[dayIndex]);
    const booked = existingBookings.some(b => b.dayIndex === dayIndex && b.timeSlot === timeSlot);
    if (weekend || booked) return;
    setSelectedCell({ day: dayIndex, time: timeSlot });
  };

  const handleConfirmSelection = () => {
    if (selectedCell) {
      onSlotSelect({ time: selectedCell.time, available: true });
      setSelectedCell(null);
    }
  };

  const monthName = selectedDate.toLocaleDateString('pt-BR', { month: 'long' });
  return (
    <div className="container my-4 p-0">
    <h2 className='fs-2'>Grade de horários - Recurso</h2>

      {/* Header */}
      <div className="mb-4 text-center">
        <h3 className="fs-2 text-muted m-0">
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
        </h3>
      </div>

      {/* Time Grid */}
      {view === 'week' && (
        <div className="table-responsive">
          <table
            className="table align-middle"
            style={{ borderCollapse: 'collapse' }}
          >
            <thead className="table-light">
              <tr>
                <th className="celula bg-white border border-white"></th>
                {dayNames.map((day, i) => (
                  <th
                    key={i}
                    className="bg-cinza text-muted border border-white text-start ps-2"
                  >
                    {day}<br />
                    <small className="text-muted fs-3">{weekDates[i].getDate()}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <th className="bg-cinza text-muted border border-white text-start ps-2" scope="row">{time}</th>
                  {weekDates.map((date, idx) => {
                    const weekend = isWeekend(date);
                    const booking = existingBookings.find(b => b.dayIndex === idx && b.timeSlot === time);
                    const booked = !!booking;
                    const selected = selectedCell?.day === idx && selectedCell?.time === time;

                    let className = "bg-cinza-claro celula cursor-pointer border border-white text-start ps-2";
                    let cellContent = "";

                    if (weekend) {
                      className = "celula bg-cinza text-muted border border-white text-start ps-2";
                    } else if (booked && booking) {
                      className = "celula reservado bg-cinza cursor-not-allowed border border-white text-start ps-2";
                      cellContent = booking.user;
                    } else if (selected) {
                      className = "celula selecionado text-light fw-bold border border-white text-start ps-2";
                      cellContent = "Selecionado";
                    }

                    return (
                      <td
                        key={idx}
                        className={className}
                        onClick={() => handleCellClick(idx, time)}
                        title={booked ? `Reservado por ${booking?.user}` : (weekend ? 'Fim de semana' : 'Disponível')}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Month view */}
      {view === 'month' && (
        <div className="card p-5 text-center border-white">
          <p className="text-muted">Visualização mensal de horários não implementada. Use a visualização semanal.</p>
        </div>
      )}

      {/* Confirm Button */}
      {selectedCell && (
        <div className="position-fixed bottom-0 end-0 mb-5 me-5">
          <button
            className="btn fw-bold"
            onClick={handleConfirmSelection}
            style={{
              backgroundColor: 'rgba(31, 173, 52, 1)',
              color: '#fff',
              borderRadius: '50px',
              padding: '10px 25px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              border: '1px solid #fff'
            }}
          >
            Confirmar escolha
          </button>
        </div>
      )}
    </div>
  );
}
