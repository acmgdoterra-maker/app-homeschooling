interface PortfolioProps {
  childId: string
}

export default function Portfolio({ childId }: PortfolioProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400">El portafolio está en construcción</p>
    </div>
  )
}
