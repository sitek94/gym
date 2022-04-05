import { Link } from '@remix-run/react'

export default function ExerciseSetIndexPage() {
  return (
    <p>
      No sets selected. Select a set on the left, or{' '}
      <Link to="new" className="text-blue-500 underline">
        create a new set.
      </Link>
    </p>
  )
}
