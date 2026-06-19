import { memo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/modals/Modal'
import { Button } from '@/components/Button'
import { CheckCircle2, ArrowRight, Edit3 } from 'lucide-react'

interface OrderSummaryData {
  budget: string
  orderName: string
  fabric: 'self' | 'tailor' | ''
}

interface Tailor {
  name: string
  shop?: string
  avatar?: string
}

interface OrderSummaryModalProps {
  open: boolean
  onClose: () => void
  order?: {
    tailor?: Tailor
    styles?: string
    price: number
    category?: string
    gender?: string
    timeline?: string
    location?: string
    fabric?: string
    notes?: string
  }
  onEdit?: () => void
  onSend?: (data: OrderSummaryData) => void
}

export const OrderSummaryModal = memo(({
  open,
  onClose,
  order,
  onEdit,
  onSend,
}: OrderSummaryModalProps) => {
  const [budget, setBudget] = useState('')
  const [orderName, setOrderName] = useState('')
  const [fabric, setFabric] = useState<'self' | 'tailor' | ''>('')

  const handleBudgetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value.replace(/[^\d,]/g, ''))
  }, [])

  const handleOrderNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderName(e.target.value)
  }, [])

  const handleFabricChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFabric(e.target.value as 'self' | 'tailor' | '')
  }, [])

  const handleSend = useCallback(() => {
    if (budget && orderName && fabric) {
      onSend?.({ budget, orderName, fabric })
    }
  }, [budget, orderName, fabric, onSend])

  if (!order) return null

  const canSend = Boolean(budget && orderName && fabric)

  return (
    <Modal open={open} onClose={onClose} size="md">
      {/* Tailor header */}
      <div className="flex items-start gap-3">
        <img
          src={
            order.tailor?.avatar ??
            'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=70'
          }
          alt={order.tailor?.name ?? 'Selected tailor'}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="font-display text-base font-bold">
            {order.tailor?.name ?? 'Selected tailor'}
          </div>
          <div className="text-sm text-primary">
            {order.tailor?.shop ?? 'Verified by i-sew'}
          </div>
        </div>
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          verified <CheckCircle2 size={14} className="text-primary" />
        </div>
      </div>

      {/* Style summary */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-accent/40 to-primary/30" />
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-muted to-secondary" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold">Styles</div>
          <p className="truncate text-xs text-muted-foreground">{order.styles}</p>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="rounded-full p-2 text-muted-foreground hover:bg-card"
          >
            <Edit3 size={14} />
          </button>
        )}
      </div>

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-2xl border-2 border-accent bg-card py-3 text-center"
      >
        <span className="text-sm text-muted-foreground">from </span>
        <span className="font-display text-lg font-bold text-primary">
          NGN {order.price.toLocaleString()}.00
        </span>
      </motion.div>

      {/* Budget */}
      <div className="mt-5">
        <label htmlFor="budget" className="mb-1.5 block text-sm font-medium">
          What's your budget?
        </label>
        <div className="flex h-12 items-center rounded-xl border-2 border-primary/40 bg-card px-4 focus-within:ring-2 focus-within:ring-ring/30">
          <span className="text-sm font-semibold text-primary">NGN</span>
          <input
            id="budget"
            type="text"
            value={budget}
            onChange={handleBudgetChange}
            placeholder="Enter amount"
            className="ml-2 w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Order name */}
      <div className="mt-4">
        <label htmlFor="orderName" className="mb-1.5 block text-sm font-medium">
          Create a name for this order
        </label>
        <input
          id="orderName"
          type="text"
          value={orderName}
          onChange={handleOrderNameChange}
          placeholder="e.g., Wedding Suit"
          className="h-12 w-full rounded-xl border-2 border-primary/40 bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Fabric provision */}
      <div className="mt-4">
        <label htmlFor="fabric" className="mb-1.5 block text-sm font-medium">
          Fabric provision
        </label>
        <select
          id="fabric"
          value={fabric}
          onChange={handleFabricChange}
          className={`h-12 w-full rounded-xl border bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 ${
            fabric ? 'border-border' : 'border-border text-muted-foreground'
          }`}
        >
          <option value="">Select an option</option>
          <option value="self">I'll provide fabric</option>
          <option value="tailor">Tailor provides fabric</option>
        </select>
      </div>

      {/* Send button */}
      <Button
        onClick={handleSend}
        disabled={!canSend}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl  py-3.5 font-semibold transition-all`}
      >
        Send order <ArrowRight size={16} />
      </Button>
    </Modal>
  )
})

OrderSummaryModal.displayName = 'OrderSummaryModal'
