import { useState, useCallback } from 'react'
import type { Stage } from '../types'

// Mock storage - replace with actual API calls later
const stageStore = new Map<string, Stage>()
const ratedStore = new Set<string>()

export const useOrderStage = (orderId: string) => {
  const [stage, setStageState] = useState<Stage>(() => 
    stageStore.get(orderId) || 'acknowledge'
  )
  const [isRated, setIsRated] = useState(() => 
    ratedStore.has(orderId)
  )

  const updateStage = useCallback((newStage: Stage) => {
    stageStore.set(orderId, newStage)
    setStageState(newStage)
  }, [orderId])

  const markAsRated = useCallback(() => {
    ratedStore.add(orderId)
    setIsRated(true)
  }, [orderId])

  return {
    stage,
    setStage: updateStage,
    isRated,
    markAsRated,
  }
}
