import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoIcon from '../../assets/logo-icon.png';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Manager',
  EMPLOYEE: 'Empleado',
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-signal' : 'text-ink-muted hover:text-ink'}`;

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const homePath = user?.role === 'EMPLOYEE' ? '/dashboard' : '/admin';

  return (
    <div className="min-h-screen bg-base">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <img src={logoIcon} alt="Gestock" className="h-9 w-9" />
            Gestock
          </div>
          <nav className="hidden items-center gap-6 sm:flex">
            <NavLink to={homePath} className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Productos
            </NavLink>
            <NavLink to="/movements" className={navLinkClass}>
              Movimientos
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-ink">{user?.name}</p>
            <p className="text-xs text-ink-muted">{user ? ROLE_LABELS[user.role] : ''}</p>
          </div>
          <button
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:text-critical"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="px-6 py-8 sm:px-10">{children}</main>
    </div>
  );
}