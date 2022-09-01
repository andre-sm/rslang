export type StatisticByDate = {
  date: Date,
  allWords: number,
  allNewWords: number,
  allGamesRight: number,
  allGamesRightPercent: number,
  allGamesWrong: number,
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

export interface Statistics {
  learnedWords: number,
  optional: {
    allStatisticsByDate: StatisticByDate[]
    wordsList: string[]
  },
}

export const defaultStatisticByDate: StatisticByDate = {
  date: new Date(),
  allWords: 0,
  allNewWords: 0,
  allGamesRight: 0,
  allGamesRightPercent: 0,
  allGamesWrong: 0,
  wordsList: [],
  games: {
    sprint: {
      right: 0,
      rightPercent: 0,
      wrong: 0,
      bestStreak: 0,
      newWords: 0,
      wordsList: []
    },
    audioCall: {
      right: 0,
      rightPercent: 0,
      wrong: 0,
      bestStreak: 0,
      newWords: 0,
      wordsList: []
    }
  }
}

export const defaultStatistics: Statistics = {
  learnedWords: 0,
  optional: {
    allStatisticsByDate: [defaultStatisticByDate],
    wordsList: []
  }
}

export interface stringifiedNewBody {
  learnedWords: number;
  optional: {
    allStatisticsByDate: string;
    wordsList: string;
  }
}

export enum GameNames {
  sprint = 'sprint',
  audioCall = 'audioCall'
}

export interface TodayStatistics {
  allNewWords: number,
  allGamesRightPercent: number,
}

export interface TodayStatisticsGame {
  newWords: number,
  rightPercent: number,
  bestStreak: number,
}

export interface AllTimeStatistic {
  
}
