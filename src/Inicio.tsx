import { useState } from 'react';
interface HomePageProps {
  onNavigate: (screen: string, resourceId?: string) => void;
}

export function Inicio({ onNavigate }: HomePageProps) {
  const quickActions = [
    {
      title: 'Fazer Reserva',
      color: '#1FAD34',
      // Não é necessário passar o segundo parâmetro, mas a função aceita.
      action: () => onNavigate('booking'), 
    },
    {
      title: 'Minhas Reservas',
      color: '#198754',
      action: () => onNavigate('my-reservations'),
    },
  ];

  return (
   <h1>inicio</h1>
  );
}