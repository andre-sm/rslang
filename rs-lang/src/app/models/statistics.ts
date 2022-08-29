export type StatisticByDate = {
  date: Date,
  newWords: number,
  allWords: number
}

export interface Statistics {
  id?: string,
  learnedWords: number,
  optional: {
    allStatisticsByDate: StatisticByDate[]
    wordsList: string[]
  },
}

export const defaultStatisticByDate: StatisticByDate = {
  date: new Date(),
  newWords: 0,
  allWords: 0
}

export const defaultStatistics: Statistics = {
  learnedWords: 0,
  optional: {
    allStatisticsByDate: [defaultStatisticByDate],
    wordsList: []
  }
}

interface TodayStatistics {
  allNewWords: number,
  allGamesRightPercent: number,
}

interface TodayStatisticsGame {
  newWords: number,
  rightPercent: number,
  bestStreak: number,
}

interface AllTimeStatistic {

}

export interface LS_Statistics {
  date: Date,
  allGamesRight: number,
  allGamesRightPercent: number,
  allGamesWrong: number,
  allNewWords: number,
  wordsList: string[],
  games: {
    sprint: {
      right: number,
      rightPercent: number,
      wrong: number,
      bestStreak: number,
      newWords: number,
      wordsList: string[]
    },
    audioCall: {
      right: number,
      rightPercent: number,
      wrong: number,
      bestStreak: number,
      newWords: number,
      wordsList: string[]
    }
  }
}
