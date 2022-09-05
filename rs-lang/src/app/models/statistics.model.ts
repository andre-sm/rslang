export type StatisticByDate = {
  date: Date,
  allWords: number,
  allNewWords: number,
  allWordsLearned: number,
  allGamesRight: number,
  allGamesRightPercent: number,
  allGamesWrong: number,
  games: {
    sprint: {
      right: number,
      rightPercent: number,
      wrong: number,
      bestStreak: number,
      newWords: number,
    },
    audioCall: {
      right: number,
      rightPercent: number,
      wrong: number,
      bestStreak: number,
      newWords: number,
    }
  }
}

export interface Statistics {
  learnedWords: number,
  optional: {
    allStatisticsByDate: StatisticByDate[]
  },
}

export const defaultStatisticByDate: StatisticByDate = {
  date: new Date(),
  allWords: 0,
  allNewWords: 0,
  allWordsLearned: 0,
  allGamesRight: 0,
  allGamesRightPercent: 0,
  allGamesWrong: 0,
  games: {
    sprint: {
      right: 0,
      rightPercent: 0,
      wrong: 0,
      bestStreak: 0,
      newWords: 0,
    },
    audioCall: {
      right: 0,
      rightPercent: 0,
      wrong: 0,
      bestStreak: 0,
      newWords: 0,
    }
  }
}

export const defaultStatistics: Statistics = {
  learnedWords: 0,
  optional: {
    allStatisticsByDate: [defaultStatisticByDate],
  }
}

export interface stringifiedNewBody {
  learnedWords: number;
  optional: {
    allStatisticsByDate: string;
  }
}

export enum GameNames {
  sprint = 'sprint',
  audioCall = 'audioCall'
}

export interface TodayStatistics {
  allNewWords: number,
  allWordsLearned: number,
  allGamesRightPercent: number,
}

export interface TodayStatisticsGame {
  newWords: number,
  rightPercent: number,
  bestStreak: number,
}
