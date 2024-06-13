import DateUtils from './DateUtils'

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
