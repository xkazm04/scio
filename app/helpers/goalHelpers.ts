export interface Goal {
  id: string
  type: 'boolean' | 'progress'
  title: string
  description: string
  completed?: boolean
  progress?: number
  current?: number
  target?: number
}

/**
 * Calculate overall progress from all goals
 */
export function calculateOverallProgress(goals: Goal[]): number {
  let totalScore = 0
  let maxScore = 0

  goals.forEach(goal => {
    if (goal.type === 'boolean') {
      maxScore += 100
      totalScore += goal.completed ? 100 : 0
    } else if (goal.type === 'progress') {
      maxScore += 100
      totalScore += goal.progress || 0
    }
  })

  return maxScore > 0 ? (totalScore / maxScore) * 100 : 0
}

/**
 * Update goal progress based on message content
 */
export function updateGoalProgress(goals: Goal[], message: string): Goal[] {
  const updatedGoals = [...goals]

  // Simple logic to update progress based on message content
  if (message.toLowerCase().includes('rozdíl') && message.toLowerCase().includes('lineární')) {
    // Complete the first boolean goal
    const firstGoal = updatedGoals.find(g => g.id === '1')
    if (firstGoal && !firstGoal.completed) {
      firstGoal.completed = true
    }
  }
  
  if (message.toLowerCase().includes('diskriminant') || message.toLowerCase().includes('řešení')) {
    // Progress on the second goal
    const secondGoal = updatedGoals.find(g => g.id === '2')
    if (secondGoal && secondGoal.type === 'progress' && (secondGoal.progress || 0) < 100) {
      secondGoal.current = Math.min((secondGoal.current || 0) + 1, secondGoal.target || 3)
      secondGoal.progress = Math.round((secondGoal.current / (secondGoal.target || 3)) * 100)
    }
  }

  return updatedGoals
}

/**
 * Get progress color class for goal progress
 */
export function getProgressColor(progress: number): string {
  if (progress === 100) {
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  } else if (progress >= 75) {
    return 'bg-gradient-to-r from-blue-500 to-blue-600'
  } else if (progress >= 50) {
    return 'bg-gradient-to-r from-indigo-500 to-indigo-600'
  } else if (progress >= 25) {
    return 'bg-gradient-to-r from-purple-500 to-purple-600'
  } else {
    return 'bg-gradient-to-r from-gray-400 to-gray-500'
  }
}
