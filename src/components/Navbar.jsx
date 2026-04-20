import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import { useStateContext } from '../context/StateContext'
import { auth } from '../services/firebase'

const navLinkClass = ({ isActive }) =>
  [
    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-neutral-100 text-neutral-900'
      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
  ].join(' ')

function Navbar() {
  const { currentUser, loading } = useAuth()
  const { selectedState } = useStateContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)

  const handleSignOut = async () => {
    closeMenu()
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Error signing out:', err)
    }
    navigate('/')
  }

  const userLabel =
    currentUser?.displayName?.trim() || currentUser?.email || 'Account'

  return (
    <header
      className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm"
      aria-label={`Primary navigation, ${selectedState}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <Link
            to="/"
            className="shrink-0 text-lg font-semibold text-neutral-900"
            onClick={closeMenu}
          >
            NagarSetu
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main"
          >
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/central" className={navLinkClass}>
              Central Initiatives
            </NavLink>
            <NavLink to="/topics" className={navLinkClass}>
              Topic Explorer
            </NavLink>
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div
              className="h-9 w-28 animate-pulse rounded-md bg-neutral-100"
              aria-hidden
            />
          ) : currentUser ? (
            <>
              <span
                className="max-w-[12rem] truncate text-sm text-neutral-700"
                title={userLabel}
              >
                {userLabel}
              </span>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-neutral-200 bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink
              to="/central"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Central Initiatives
            </NavLink>
            <NavLink
              to="/topics"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Topic Explorer
            </NavLink>

            <div className="my-2 border-t border-neutral-200" />

            {loading ? (
              <div
                className="h-10 w-full animate-pulse rounded-md bg-neutral-100"
                aria-hidden
              />
            ) : currentUser ? (
              <div className="flex flex-col gap-3">
                <p className="truncate px-3 text-sm text-neutral-700">
                  {userLabel}
                </p>
                <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-left text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={navLinkClass} onClick={closeMenu}>
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
