import { ReactNode } from 'react';
import { Screen } from './types';
import { Home, Dumbbell } from 'lucide-react';


interface LayoutProps {
  children: ReactNode;
  onNavigate: (screen: Screen, resourceId?: string) => void;
}

export function Layout({ children, onNavigate }: LayoutProps) {
  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-preto-claro sidebar vh-100 border-end position-fixed">
          <div className="p-3 sidebar-sticky d-flex flex-column justify-content-between h-100">
            <div>
              <img className='img-g' src="/img/fotosuap.png" alt="" />
              <ul className="nav flex-column mb-4">

                {/* Início */}
                <li className="nav-item mb-2">
                  <button
                    className="btn text-white w-100 text-start d-flex align-items-center gap-2"
                    onClick={() => onNavigate('home')}
                  >
                    <Home size={18} color="#0F827F" />
                    Início
                  </button>
                </li>


                {/* Dropdown Reservas */}
                <li className="nav-item mb-2">
                <button
                  className="btn text-white w-100 text-start d-flex justify-content-between align-items-center"
                  data-bs-toggle="collapse"
                  data-bs-target="#menuReservas"
                  aria-expanded="false"
                >
                  <span className="d-flex align-items-center gap-2">
                    <Dumbbell size={18} color="#0F827F" />
                    Espaço esportivo
                  </span>
                </button>

                  <div className="collapse ps-3" id="menuReservas">
                    <ul className="nav flex-column mt-2">
                      <li className="nav-item mb-1">
                        <button
                          className="btn text-white w-100 text-start"
                          onClick={() => onNavigate('booking')}
                        >
                          Fazer Reserva
                        </button>
                      </li>

                      <li className="nav-item mb-1">
                        <button
                          className="btn text-white w-100 text-start"
                          onClick={() => onNavigate('my-reservations')}
                        >
                          Minhas Reservas
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>

              </ul>

            </div>
          </div>
        </nav>
        <main className="col-md-10 bg-cinza-claro-claro offset-md-2 py-4">{children}</main>
      </div>
    </div>
  );
}
