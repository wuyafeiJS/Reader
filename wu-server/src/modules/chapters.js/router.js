import { ensureUser } from '../../middleware/validators'
import * as chapter from './controller'

export const baseUrl = '/chapters'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      chapter.getChapterInfo
    ]
  },
  {
    method: 'GET',
    route: '/firstRender',
    handlers: [
      ensureUser,
      chapter.getFirstRenderChapter
    ]
  },
  {
    method: 'GET',
    route: '/next/:id',
    handlers: [
      chapter.getNextChapterInfo
    ]
  },
  {
    method: 'GET',
    route: '/last/:id',
    handlers: [
      chapter.getLastChapterInfo
    ]
  },
]
