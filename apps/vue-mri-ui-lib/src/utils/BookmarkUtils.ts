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

  while (true) {
    let isUnique = true

    for (const bookmark of bookmarks) {
      if (username === bookmark.user_id && bookmark.bookmarkname === uniqueName) {
        isUnique = false
        break
      }
    }

    if (isUnique) {
      return uniqueName
    } else {
      suffix += 1
      uniqueName = `${baseName} ${suffix}`
    }
  }
}