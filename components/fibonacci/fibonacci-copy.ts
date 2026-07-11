export const fibonacciCopy = {
  zh: {
    eyebrow: '斐波那契数字合成',
    title: '合成 2584',
    subtitle: '沿着数列的轨迹，把相邻数字合成到 2584。',
    score: '当前得分',
    best: '最高得分',
    newGame: '重新开始',
    playAgain: '再玩一局',
    howToPlay: '玩法说明',
    sequence: '斐波那契数列',
    sequenceDetail: '1、1、2、3、5、8、13、21、34、55、89……',
    move: '移动方块',
    moveDetail: '电脑使用方向键，手机在棋盘上滑动。',
    merge: '合成规则',
    mergeDetail: '数列中相邻的数字可以相加，例如 1+1=2、2+3=5。',
    goal: '最终目标',
    goalDetail: '不断合成，抵达闪耀的 2584。',
    win: '成功抵达 2584！',
    winDetail: '漂亮！你完成了这段斐波那契旅程。',
    gameOver: '本局结束',
    gameOverDetail: '棋盘已满，没有可以继续合成的数字。',
    finalScore: '本局得分',
    continue: '继续挑战',
    boardLabel: '斐波那契 2584 游戏棋盘'
  },
  en: {
    eyebrow: 'Fibonacci number merge', title: 'Build 2584', subtitle: 'Follow the sequence and merge your way to 2584.',
    score: 'Score', best: 'Best', newGame: 'New game', playAgain: 'Play again', howToPlay: 'How to play',
    sequence: 'Fibonacci sequence', sequenceDetail: '1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89…',
    move: 'Move tiles', moveDetail: 'Use arrow keys on desktop or swipe across the board on mobile.',
    merge: 'Merge rule', mergeDetail: 'Adjacent numbers in the sequence combine, such as 1+1=2 and 2+3=5.',
    goal: 'The goal', goalDetail: 'Keep merging until you reach the glowing 2584 tile.',
    win: 'You reached 2584!', winDetail: 'Beautifully played — you completed the Fibonacci journey.',
    gameOver: 'Game over', gameOverDetail: 'The board is full and no more merges are available.',
    finalScore: 'Final score', continue: 'Keep playing', boardLabel: 'Fibonacci 2584 game board'
  }
} as const

export type FibonacciCopy = {
  [Key in keyof typeof fibonacciCopy.en]: string
}
