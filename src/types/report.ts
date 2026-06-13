import type { QueryParams } from './pagination'

export type ReportType = 'expenses' | 'debts' | 'payments'

export interface ReportQueryParams extends QueryParams {
  type?: ReportType
}
