interface LibraryProps {
  childId: string
}

export default function Library({ childId }: LibraryProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400">La biblioteca está en construcción</p>
    </div>
  )
}
