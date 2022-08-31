import { UserAggregatedWord } from "./user-aggregated-word.model";

export interface UserAggregatedWordResponse {
  paginatedResults: UserAggregatedWord[];
  totalCount: {
    count: number;
  }[]
}