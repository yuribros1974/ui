import { CONSUMER_GROUPS_PAGE } from '../../constants'

export const generatePageData = () => {
  return {
    page: CONSUMER_GROUPS_PAGE,
    tableHeaders: [
      {
        header: 'Consumer group name',
        class: 'table-cell-1'
      },
      {
        header: 'Stream Path',
        class: 'table-cell-1'
      },
      {
        header: 'Real time functions',
        class: 'table-cell-1'
      }
    ]
  }
}
