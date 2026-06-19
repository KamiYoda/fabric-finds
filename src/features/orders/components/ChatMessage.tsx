import { memo } from 'react'
import { FileText, Download } from 'lucide-react'
import type { Msg } from '../utils/mockMessages'

interface ChatMessageProps {
  message: Msg
}

export const ChatMessage = memo(({ message }: ChatMessageProps) => {
  const isMe = message.from === 'me'

  // Text message
  if ('text' in message) {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
            isMe
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm">{message.text}</p>
          <div className={`mt-1 text-[10px] ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            {message.time}
          </div>
        </div>
      </div>
    )
  }

  // File message
  if ('file' in message) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[70%] rounded-2xl bg-muted p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText size={18} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{message.file.name}</div>
              <div className="text-xs text-muted-foreground">PDF · 245 KB</div>
            </div>
            <button className="text-primary hover:text-primary/80">
              <Download size={16} />
            </button>
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground">{message.time}</div>
        </div>
      </div>
    )
  }

  // Milestone message
  if ('milestone' in message) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl bg-success/10 p-4">
          <div className="font-semibold text-success">{message.milestone.label}</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {message.milestone.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Milestone ${i + 1}`}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground">{message.time}</div>
        </div>
      </div>
    )
  }

  return null
})

ChatMessage.displayName = 'ChatMessage'
