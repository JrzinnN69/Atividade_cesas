import { useState } from 'react';
import { Layout } from './Layout';
import { Inicio } from './Inicio';
import { Recursos } from './Recursos';
import { Agendamento } from './Agendamento';
import { MinhasReservas } from './MinhasReservas';
import { Screen, Resource, Reservation } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Screen>('home');
  const [preSelectedResourceId, setPreSelectedResourceId] = useState<string | undefined>();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const allResources: Resource[] = [
    { id: '1', name: 'Quadra', category: 'Quadra Coberta', image: 'https://images.unsplash.com/photo-1761644273884-83839f8f22e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg', sportType: 'Coletivo', resourceType: 'Quadra' },
    { id: '2', name: 'Society', category: 'Campo', image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?crop=entropy&cs=tinysrgb&fit=max&fm=jpg', sportType: 'Coletivo', resourceType: 'Campo' },
    { id: '3', name: 'Piscina', category: 'Área Aquática', image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg', sportType: 'Individual', resourceType: 'Piscina' },
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
      {currentPage === 'resources' && <Recursos resources={allResources} onNavigate={handleNavigate} />}
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
