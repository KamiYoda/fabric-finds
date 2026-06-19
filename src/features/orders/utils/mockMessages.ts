export type Msg =
  | { id: string; from: 'me' | 'them'; text: string; time: string }
  | { id: string; from: 'them'; file: { name: string }; time: string }
  | { id: string; from: 'them'; milestone: { label: string; images: string[] }; time: string }

export const INITIAL_MSGS: Msg[] = [
  {
    id: '1',
    from: 'me',
    text: "Pls as soon as you confirm you're okay with the request let me know how soon it can be ready.",
    time: '09:41 am',
  },
  { id: '2', from: 'them', text: 'Hello', time: '09:41 am' },
  { id: '3', from: 'them', file: { name: 'Outfit Invoice.PDF' }, time: '09:41 am' } as any,
  { id: '4', from: 'them', text: 'Here is an invoice for your perusal', time: '09:41 am' },
  { id: '5', from: 'me', text: "40k is a stretch, let's do 35k pls?", time: '09:41 am' },
  { id: '6', from: 'them', text: 'Well, that should do it.', time: '09:41 am' },
  {
    id: '7',
    from: 'them',
    text: "I'll confirm your order now so you can make payment.",
    time: '09:41 am',
  },
  { id: '8', from: 'me', text: "Alright then thank you.", time: '09:41 am' },
]

export const FABRIC_MSGS: Msg[] = [
  {
    id: 'f1',
    from: 'them',
    text: "Hello, I've been notified of the payment. When will the fabrics be delivered?",
    time: '09:41 am',
  },
  { id: 'f2', from: 'me', text: "Pls confirm delivery address", time: '09:41 am' },
  { id: 'f3', from: 'them', text: "32 Gibbons Estate Shoms, Lagos.", time: '09:41 am' },
  { id: 'f4', from: 'me', text: "I'll send it now", time: '09:41 am' },
  { id: 'f5', from: 'them', text: "Alright I'll be expecting", time: '09:41 am' },
]

export const STARTED_MSGS: Msg[] = [
  {
    id: 's1',
    from: 'me',
    text: "Hi can you confirm you've received the fabrics?",
    time: '09:41 am',
  },
  { id: 's2', from: 'them', text: "Just did. Work will start right away", time: '09:41 am' },
  { id: 's3', from: 'me', text: "Hi there, how's the work coming along?", time: '09:41 am' },
  {
    id: 's4',
    from: 'them',
    text: "Hi there\nIt's going fine. It's 50% done and should be ready in the next couple of days",
    time: '09:41 am',
  },
  {
    id: 's5',
    from: 'me',
    text: "Okay but the milestone is still showing you're in cutting stage",
    time: '09:41 am',
  },
  {
    id: 's6',
    from: 'them',
    text: "Yes that's because I've been busy. I'll update it in a moment",
    time: '09:41 am',
  },
]

export const CUTTING_MSG: Msg = {
  id: 'c1',
  from: 'them',
  time: '09:41 am',
  milestone: {
    label: 'Cutting completed',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=70',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=70&sat=-30',
    ],
  },
} as any

export const DELIVERY_MSGS: Msg[] = [
  {
    id: 'd1',
    from: 'them',
    text: 'Coming through. Pls confirm delivery address',
    time: '09:41 am',
  },
  { id: 'd2', from: 'me', text: "Looks great! Exactly as I imagined🥰", time: '09:41 am' },
  { id: 'd3', from: 'me', text: "17 Koffi street, Lagos", time: '09:41 am' },
  { id: 'd4', from: 'them', text: "I'm glad you like it", time: '09:41 am' },
  { id: 'd5', from: 'them', text: "Will be sending now", time: '09:41 am' },
  { id: 'd6', from: 'me', text: "Okay", time: '09:41 am' },
  {
    id: 'd7',
    from: 'them',
    text: "Dispatch notified me you've received the parcel. Kindly mark the order as complete and rate me pls",
    time: '09:41 am',
  },
  {
    id: 'd8',
    from: 'me',
    text: "That's right I really love the dress. I'll do that now",
    time: '09:41 am',
  },
]
