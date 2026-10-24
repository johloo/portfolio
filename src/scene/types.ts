import type { SectionId } from '../data/portfolio'

export interface SceneInteraction {
  section: SectionId | null
  projectId: string | null
  skillId: string | null
  experienceId: string | null
  reducedMotion: boolean
  onSelectSection: (id: SectionId) => void
  onSelectProject: (id: string) => void
  onSelectSkill: (id: string) => void
  onSelectExperience: (id: string) => void
}
