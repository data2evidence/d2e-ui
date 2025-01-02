import DateUtils from './DateUtils'

export default function formatBookmarkDisplay(element) {
  return {
    bookmark: getBookmark(element.bookmark),
    cohortDefinition: element.cohortDefinition,
  }
}

function getBookmark(bookmark: FormattedBookmark) {
  if (!bookmark) {
    return null
  }
  const bookmarkObj = JSON.parse(bookmark.bookmark)
  if (!bookmarkObj.filter && !bookmarkObj.filter.cards) {
    return null
  }

  const filterCards = bookmarkObj.filter.cards
  const boolContainers = filterCards.content

  return {
    id: bookmark.bmkId,
    username: bookmark.user_id,
    name: bookmark.bookmarkname,
    viewName: bookmark.viewname,
    data: bookmark.bookmark,
    version: bookmark.version,
    dateModified: DateUtils.displayBookmarkDateFormat(bookmark.modified),
    timeModified: DateUtils.displayBookmarkTimeFormat(bookmark.modified),
    filterCardData: boolContainers,
    chartType: bookmarkObj.chartType,
    axisInfo: bookmarkObj.chartType === 'list' ? bookmarkObj.filter.selected_attributes : bookmarkObj.axisSelection,
    shared: bookmark.shared,
  }
}
