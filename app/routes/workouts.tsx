import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react'

import { requireUserId } from '~/session.server'
import { getNoteListItems } from '~/models/note.server'

type LoaderData = {
  noteListItems: Awaited<ReturnType<typeof getNoteListItems>>
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const noteListItems = await getNoteListItems({ userId })
  return json<LoaderData>({ noteListItems })
}

export default function NotesPage() {
  const data = useLoaderData() as LoaderData

  return (
    <main className="flex h-full bg-white">
      <div className="h-full w-80 border-r bg-gray-50">
        <Link to="new" className="block p-4 text-xl text-blue-500">
          + New Workout
        </Link>

        <hr />

        {data.noteListItems.length === 0 ? (
          <p className="p-4">No notes yet</p>
        ) : (
          <ol>
            {data.noteListItems.map(note => (
              <li key={note.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`
                  }
                  to={note.id}
                >
                  📝 {note.title}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </main>
  )
}
