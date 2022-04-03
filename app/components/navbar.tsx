import * as React from 'react'
import { Form, Link, NavLink } from '@remix-run/react'
import { useOptionalUser } from '../utils'
import clsx from 'clsx'

const LINKS = [
  { name: 'Exercises', path: '/exercises' },
  { name: 'Workouts', path: '/workouts' },
  { name: 'Notes', path: '/notes' },
]

export function Navbar() {
  const user = useOptionalUser()

  if (!user) {
    return null
  }

  return (
    <nav className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <div>
        <Link to="/">
          <h1 className="text-3xl font-bold">Gym 💪</h1>
        </Link>
      </div>

      <ul className="flex gap-x-2">
        {LINKS.map(({ name, path }) => (
          <li key={name}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                clsx(
                  'px-4 py-2 rounded border-2 border-transparent',
                  isActive && 'border-slate-600',
                )
              }
            >
              {name}
            </NavLink>
          </li>
        ))}
      </ul>

      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </nav>
  )
}
