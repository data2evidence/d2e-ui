import DateUtils from './DateUtils'
import { getPortalAPI } from './PortalUtils'

export default function formatBookmarkDisplay(element, bookmarkObj) {
  const filterCards = bookmarkObj.filter.cards
  const boolContainers = filterCards.content
  return {
    id: element.bmkId,
    username: element.user_id,
    name: element.bookmarkname,
    viewName: element.viewname,
    data: element.bookmark,
    version: element.version,
    dateModified: DateUtils.displayBookmarkDateFormat(element.modified),
    timeModified: DateUtils.displayBookmarkTimeFormat(element.modified),
    filterCardData: boolContainers,
    chartType: bookmarkObj.chartType,
    axisInfo: bookmarkObj.chartType === 'list' ? bookmarkObj.filter.selected_attributes : bookmarkObj.axisSelection,
    shared: element.shared,
  }
}

export function generateUniqueName(bookmarks) {
  const username = getPortalAPI().username
  const baseName = 'New cohort'
  let uniqueName = baseName
  let suffix = 0

  const userBookmarks = bookmarks.filter(bookmark => bookmark.user_id === username)
  const nameExists = name => userBookmarks.some(bookmark => bookmark.bookmarkname === name)

  while (nameExists(uniqueName)) {
    suffix += 1
    uniqueName = `${baseName} ${suffix}`
  }

  return uniqueName
}