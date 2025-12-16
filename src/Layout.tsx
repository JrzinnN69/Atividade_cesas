import { ReactNode } from 'react';
import { Screen } from './types';

interface LayoutProps {
  children: ReactNode;
  onNavigate: (screen: Screen, resourceId?: string) => void;
}

export function Layout({ children, onNavigate }: LayoutProps) {
  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-light sidebar vh-100 border-end position-fixed">
          <div className="p-3 sidebar-sticky d-flex flex-column justify-content-between h-100">
            <div>
              <h5 className="mb-4 ps-2">SUAP</h5>
              <ul className="nav flex-column mb-4">
                <li className="nav-item mb-2"><button className="btn btn-link w-100 text-start" onClick={() => onNavigate('home')}>Início</button></li>
                <li className="nav-item mb-2"><button className="btn btn-link w-100 text-start" onClick={() => onNavigate('booking')}>Agendar</button></li>
                <li className="nav-item mb-2"><button className="btn btn-link w-100 text-start" onClick={() => onNavigate('my-reservations')}>Minhas Reservas</button></li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="col-md-10 offset-md-2 py-4">{children}</main>
      </div>
    </div>
  );
}
