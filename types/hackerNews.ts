export interface AlgoliaComment {
  id: number
  created_at: string
  created_at_i: number
  author: string | null
  text: string | null
  points: number | null
  parent_id: number | null
  story_id: number | null
  children: AlgoliaComment[]
  type: string
}

export interface AlgoliaStory {
  id: number
  created_at: string
  created_at_i: number
  author: string
  title: string
  url: string | null
  text: string | null
  points: number
  parent_id: number | null
  story_id: number | null
  children: AlgoliaComment[]
  type: string
}
