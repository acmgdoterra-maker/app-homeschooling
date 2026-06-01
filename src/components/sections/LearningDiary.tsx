interface LearningDiaryProps {
  childId: string
}

export default function LearningDiary({ childId }: LearningDiaryProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400">El diario de aprendizaje está en construcción</p>
    </div>
  )
}
