import { useState } from 'react';
import { Layout } from './Layout';
import { Inicio } from './Inicio';
import { Agendamento } from './Agendamento';
import { MinhasReservas } from './MinhasReservas';
import { Screen, Resource, Reservation } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Screen>('home');
  const [preSelectedResourceId, setPreSelectedResourceId] = useState<string | undefined>();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const allResources: Resource[] = [
  {
    id: '1',
    name: 'Quadra',
    category: 'Quadra Coberta',
    sportType: 'Coletivo',
    resourceType: 'Quadra',
    icon: 'quadra',
  },
  {
    id: '2',
    name: 'Academia',
    category: 'Treino',
    sportType: 'Individual',
    resourceType: 'Treino',
    icon: 'campo',
  },
  {
    id: '3',
    name: 'Piscina',
    category: 'Área Aquática',
    sportType: 'Individual',
    resourceType: 'Piscina',
    icon: 'piscina',
  },
];

  const handleNavigate = (screen: Screen, resourceId?: string) => {
    setCurrentPage(screen);
    setPreSelectedResourceId(resourceId);
  };

  const handleReservationComplete = (reservation: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
      status: 'confirmed',
      createdAt: new Date(),
      materials: [],
    };
    setReservations([...reservations, newReservation]);
  };

  const handleCancelReservation = (id: string) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  };

  return (
    <Layout onNavigate={handleNavigate}>
      {currentPage === 'home' && <Inicio onNavigate={handleNavigate} />}
      {currentPage === 'resources'}
      {currentPage === 'booking' && (
        <Agendamento
          resources={allResources}
          preSelectedResourceId={preSelectedResourceId}
          onNavigate={handleNavigate}
          onReservationComplete={handleReservationComplete}
        />
      )}
      {currentPage === 'my-reservations' && (
        <MinhasReservas
          reservations={reservations}
          onNavigate={handleNavigate}
          onCancelReservation={handleCancelReservation}
        />
      )}
    </Layout>
  );
}
