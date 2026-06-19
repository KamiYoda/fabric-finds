import { memo, useCallback, useState } from 'react'
import { BadgeCheck, Trash2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import type { Tailor } from '@/features/tailors/types'
import { saveTailor } from '@/lib/api/tailors'
import { Button } from '@/components/Button'

interface MyTailorsCardProps {
  tailor: Tailor
  onClick: (tailor: Tailor) => void
  onRemove?: (tailorId: string) => void
}

export const MyTailorsCard = memo(({ tailor, onClick, onRemove }: MyTailorsCardProps) => {
  const handleClick = useCallback(() => {
    onClick(tailor)
  }, [onClick, tailor])

  const removeMutation = useMutation({
    mutationFn: () => saveTailor(tailor.id, false),
    onSuccess: () => {
      onRemove?.(tailor.id)
    },
  })

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      removeMutation.mutate()
    },
    [removeMutation],
  )

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-2xl border border-border bg-card p-4 text-left transition-all hover:shadow-soft"
    >
      <div className="flex items-start gap-3">
        <img
          src={tailor.avatar || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=70'}
          alt={tailor.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display font-semibold">{tailor.name}</h3>
            {tailor.verified && (
              <span className="shrink-0 text-xs text-primary">
                verified <BadgeCheck size={12} className="inline fill-primary text-primary-foreground" />
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{tailor.location}</p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {tailor.bio || 'About tailor lorem ipsum summary About tailor lorem ipsum summary'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tailor.specialties?.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleRemove}
          disabled={removeMutation.isPending}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive disabled:opacity-50"
        >
          <Trash2 size={14} /> Remove
        </button>
        <Button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <span className="text-lg leading-none">+</span> New
        </Button>
      </div>
    </button>
  )
})

MyTailorsCard.displayName = 'MyTailorsCard'
