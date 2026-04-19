import { getBrainstormCards } from '@/lib/actions/brainstorm'
import BrainstormClient from '@/components/brainstorm/brainstorm-client'

export default async function BrainstormPage() {
  const ideas = await getBrainstormCards()

  return <BrainstormClient initialIdeas={ideas} />
}