import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
      <footer className="border-t border-neutral-200 bg-white py-6 text-sm text-neutral-600">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-neutral-800">NagarSetu</p>
          <p className="text-neutral-500">
            Civic information — schemes and initiatives for citizens.
          </p>
        </div>
      </footer>
    </div>
  )
}
