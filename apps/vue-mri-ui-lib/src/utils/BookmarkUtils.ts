import DateUtils from './DateUtils'

export default function formatBookmarkDisplay(element) {
  const bookmarkObj = getBookmarkObj(element.bookmark)
  const filterCards = bookmarkObj.filter.cards
  const boolContainers = filterCards.content
  const bookmark = element.bookmark

  return {
    bookmark:
      bookmark && bookmarkObj
        ? {
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
            axisInfo:
              bookmarkObj.chartType === 'list' ? bookmarkObj.filter.selected_attributes : bookmarkObj.axisSelection,
            shared: bookmark.shared,
          }
        : null,
  }
}

function getBookmarkObj(bookmark: FormattedBookmark) {
  const bookmarkObj = JSON.parse(bookmark.bookmark)
  return bookmarkObj?.filter && bookmarkObj?.filter?.cards ? bookmarkObj : null
}
