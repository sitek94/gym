import { Link } from '@remix-run/react'

export default function ExerciseIndexPage() {
  return (
    <p>
      No exercise selected. Select an exercise on the left, or{' '}
      <Link to="new" className="text-blue-500 underline">
        create a new exercise.
      </Link>
    </p>
  )
}
