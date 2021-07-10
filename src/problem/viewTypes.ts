export type areas = 'GitDirectory' | 'GitGraph' | 'GitStagingArea' | 'GitRemote'

export const visualizationArea = {
  GitDirectory: 0,
  GitGraph: 1,
  GitStagingArea: 2,
  GitRemote: 3,
} as { [key in areas]: 0 | 1 | 2 | 3 }