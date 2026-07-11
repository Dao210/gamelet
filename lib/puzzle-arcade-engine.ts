export type PuzzleArcadeId = 'sequence-forge' | 'pattern-loom' | 'equation-vault' | 'word-bridge' | 'logic-switch' | 'shape-signal'

export interface ArcadeQuestion {
  prompt: string
  display: string[]
  options: string[]
  answer: number
  explanation: string
  explanationZh?: string
}

export interface PuzzleArcadeDefinition {
  id: PuzzleArcadeId
  title: string
  accentTitle: string
  discipline: string
  intro: string
  introZh: string
  instruction: string
  instructionZh: string
  accent: string
  secondary: string
  background: string
  motif: string
  questions: ArcadeQuestion[]
}

export interface ArcadeSession {
  round: number
  score: number
  streak: number
  bestStreak: number
  lives: number
  correct: number
}

export function createArcadeSession(): ArcadeSession {
  return { round: 0, score: 0, streak: 0, bestStreak: 0, lives: 3, correct: 0 }
}

export function answerArcadeQuestion(session: ArcadeSession, question: ArcadeQuestion, optionIndex: number, usedHint = false) {
  const correct = optionIndex === question.answer
  const streak = correct ? session.streak + 1 : 0
  const points = correct ? Math.max(60, 120 + Math.min(session.streak, 4) * 30 - (usedHint ? 50 : 0)) : 0
  const next: ArcadeSession = {
    round: session.round + 1,
    score: session.score + points,
    streak,
    bestStreak: Math.max(session.bestStreak, streak),
    lives: Math.max(0, session.lives - (correct ? 0 : 1)),
    correct: session.correct + (correct ? 1 : 0)
  }
  return { correct, points, session: next, finished: next.lives === 0 }
}

export function getHintedOptions(question: ArcadeQuestion) {
  const incorrect = question.options.map((_, index) => index).filter((index) => index !== question.answer)
  return incorrect.slice(0, Math.max(1, incorrect.length - 1))
}

export const PUZZLE_ARCADES: Record<PuzzleArcadeId, PuzzleArcadeDefinition> = {
  'sequence-forge': {
    id: 'sequence-forge', title: 'SEQUENCE', accentTitle: 'FORGE', discipline: 'NUMBER WORKSHOP / 07', accent: '#ff6b35', secondary: '#ffd166', background: '#17130f', motif: '2 · 4 · 8 · ?',
    intro: 'Read the rhythm of numbers. Strike the missing value while the pattern is still hot.', introZh: '读懂数字的节奏，在规律尚未冷却前锻造出缺失的数值。', instruction: 'Complete the number sequence', instructionZh: '补全数字序列',
    questions: [
      { prompt: 'Double each step', display: ['2', '4', '8', '16', '?'], options: ['24', '30', '32', '34'], answer: 2, explanation: 'Each value is multiplied by 2.' },
      { prompt: 'Add consecutive odd numbers', display: ['1', '4', '9', '16', '?'], options: ['20', '24', '25', '27'], answer: 2, explanation: 'These are consecutive square numbers.' },
      { prompt: 'Two patterns interlace', display: ['3', '10', '6', '20', '12', '?'], options: ['30', '36', '40', '44'], answer: 2, explanation: 'Odd positions double; even positions are 10, 20, 40.' },
      { prompt: 'Differences grow by one', display: ['5', '7', '10', '14', '19', '?'], options: ['23', '24', '25', '26'], answer: 2, explanation: 'Add 2, 3, 4, 5, then 6.' },
      { prompt: 'Look back two places', display: ['2', '3', '5', '8', '13', '?'], options: ['18', '20', '21', '24'], answer: 2, explanation: 'Each value is the sum of the previous two.' }
    ]
  },
  'pattern-loom': {
    id: 'pattern-loom', title: 'PATTERN', accentTitle: 'LOOM', discipline: 'SYMBOL TEXTILE / 08', accent: '#e95d9b', secondary: '#70d6ff', background: '#160f19', motif: '▲ ○ ▲ ◆',
    intro: 'Threads of symbols cross and repeat. Choose the tile that finishes each woven rule.', introZh: '符号丝线交错重复，选择能够完成编织规律的图块。', instruction: 'Finish the woven pattern', instructionZh: '完成图形编织规律',
    questions: [
      { prompt: 'Alternating thread', display: ['▲', '○', '▲', '○', '?'], options: ['○', '▲', '◆', '□'], answer: 1, explanation: 'Triangle and circle alternate.' },
      { prompt: 'One, then two', display: ['◆', '○', '◆', '◆', '○', '?'], options: ['○', '◆', '▲', '◇'], answer: 1, explanation: 'One diamond, one circle, two diamonds, one circle.' },
      { prompt: 'Rotating corner', display: ['◰', '◳', '◲', '?'], options: ['◱', '◰', '◳', '■'], answer: 0, explanation: 'The filled corner rotates clockwise.' },
      { prompt: 'Growing group', display: ['●', '○', '●●', '○○', '?'], options: ['○○○', '●●●', '●○●', '●●'], answer: 1, explanation: 'Groups alternate color and grow by one.' },
      { prompt: 'Mirror the first half', display: ['△', '□', '◆', '◆', '□', '?'], options: ['◆', '○', '△', '□'], answer: 2, explanation: 'The sequence mirrors around its center.' }
    ]
  },
  'equation-vault': {
    id: 'equation-vault', title: 'EQUATION', accentTitle: 'VAULT', discipline: 'SECURE ARITHMETIC / 09', accent: '#e7c85c', secondary: '#5ed0a8', background: '#101715', motif: '7 × ? = 42',
    intro: 'Every lock has one exact value. Resolve the operation and open the vault cleanly.', introZh: '每道锁只有一个准确数值，解开运算并干净利落地打开保险库。', instruction: 'Find the missing value', instructionZh: '找出缺失数值',
    questions: [
      { prompt: 'Balance the multiplication', display: ['7', '×', '?', '=', '42'], options: ['5', '6', '7', '8'], answer: 1, explanation: '42 divided by 7 equals 6.' },
      { prompt: 'Undo the subtraction', display: ['?', '−', '18', '=', '27'], options: ['35', '43', '45', '47'], answer: 2, explanation: '27 + 18 equals 45.' },
      { prompt: 'Respect operation order', display: ['8', '+', '3', '×', '?', '=', '20'], options: ['2', '3', '4', '6'], answer: 2, explanation: 'Multiplication first: 8 + 12 = 20.' },
      { prompt: 'Split the square', display: ['?', '²', '−', '9', '=', '40'], options: ['6', '7', '8', '9'], answer: 1, explanation: '49 − 9 equals 40.' },
      { prompt: 'Close the fraction', display: ['(', '18', '+', '?', ')', '÷', '6', '=', '5'], options: ['10', '11', '12', '14'], answer: 2, explanation: 'The numerator must be 30.' }
    ]
  },
  'word-bridge': {
    id: 'word-bridge', title: 'WORD', accentTitle: 'BRIDGE', discipline: 'LEXICAL CROSSING / 10', accent: '#47b8e0', secondary: '#ffcc5c', background: '#0d1720', motif: 'COLD → CORD',
    intro: 'Change one letter at a time. Find the word that safely connects both banks.', introZh: '每次只改变一个字母，找到能够安全连接两岸的单词。', instruction: 'Choose the valid bridge word', instructionZh: '选择正确的桥接单词',
    questions: [
      { prompt: 'Change COLD toward WARM', display: ['COLD', '→', '?', '→', 'CARD'], options: ['CORD', 'WOLD', 'CORE', 'CART'], answer: 0, explanation: 'COLD → CORD → CARD changes one letter each time.' },
      { prompt: 'Bridge HEAD to TAIL', display: ['HEAD', '→', '?', '→', 'TEAL'], options: ['HEAL', 'TEAR', 'HEAT', 'DEAL'], answer: 0, explanation: 'HEAD → HEAL → TEAL.' },
      { prompt: 'Bridge MIND to BODY', display: ['MIND', '→', '?', '→', 'BOND'], options: ['MEND', 'BIND', 'MOLD', 'WIND'], answer: 1, explanation: 'MIND → BIND → BOND.' },
      { prompt: 'Bridge SAND to LAND', display: ['SAND', '→', '?', '→', 'LEND'], options: ['SEND', 'SANE', 'BAND', 'LEND'], answer: 0, explanation: 'SAND → SEND → LEND.' },
      { prompt: 'Bridge FIRE to COLD', display: ['FIRE', '→', '?', '→', 'CORD'], options: ['FORE', 'FIRM', 'CORE', 'TIRE'], answer: 2, explanation: 'FIRE → CORE → CORD.' }
    ]
  },
  'logic-switch': {
    id: 'logic-switch', title: 'LOGIC', accentTitle: 'SWITCH', discipline: 'BINARY CONTROL / 11', accent: '#9cff57', secondary: '#53f4ff', background: '#07110b', motif: 'ON · OFF · ON',
    intro: 'Read the control rule, trace the states, and throw the only switch that keeps the circuit true.', introZh: '读取控制规则、追踪开关状态，拨动唯一能让电路成立的选项。', instruction: 'Resolve the logic state', instructionZh: '推导正确的逻辑状态',
    questions: [
      { prompt: 'AND is on only when both inputs are on', display: ['ON', 'AND', 'OFF', '=', '?'], options: ['ON', 'OFF', 'BOTH', 'ERROR'], answer: 1, explanation: 'AND requires both inputs to be ON.' },
      { prompt: 'OR is on when either input is on', display: ['OFF', 'OR', 'ON', '=', '?'], options: ['OFF', 'ON', 'BOTH', 'ERROR'], answer: 1, explanation: 'One ON input makes OR true.' },
      { prompt: 'NOT reverses its input', display: ['NOT', 'ON', '=', '?'], options: ['ON', 'OFF', 'SAME', 'BOTH'], answer: 1, explanation: 'NOT ON is OFF.' },
      { prompt: 'XOR is on when inputs differ', display: ['ON', 'XOR', 'ON', '=', '?'], options: ['ON', 'OFF', 'BOTH', 'ERROR'], answer: 1, explanation: 'Equal inputs make XOR false.' },
      { prompt: 'Evaluate inside the brackets first', display: ['NOT', '(', 'OFF', 'OR', 'ON', ')', '=', '?'], options: ['ON', 'OFF', 'BOTH', 'ERROR'], answer: 1, explanation: 'OFF OR ON is ON; NOT ON is OFF.' }
    ]
  },
  'shape-signal': {
    id: 'shape-signal', title: 'SHAPE', accentTitle: 'SIGNAL', discipline: 'SPATIAL TRANSMISSION / 12', accent: '#ff8a5b', secondary: '#a88cff', background: '#17121d', motif: '△ ↻ ▷',
    intro: 'A shape enters the transmitter and leaves transformed. Infer the machine between them.', introZh: '图形进入发射器后发生变化，推断机器的空间变换规则。', instruction: 'Choose the transformed shape', instructionZh: '选择变换后的图形',
    questions: [
      { prompt: 'Rotate 90° clockwise', display: ['▲', '↻', '?'], options: ['◀', '▶', '▼', '▲'], answer: 1, explanation: 'Up rotated clockwise points right.' },
      { prompt: 'Reflect across a vertical mirror', display: ['◁●', '│', '?'], options: ['●▷', '▷●', '●◁', '◁●'], answer: 1, explanation: 'The order and triangle direction both mirror.' },
      { prompt: 'Add one side', display: ['△', '→', '□', '→', '?'], options: ['○', '⬠', '◇', '⬡'], answer: 1, explanation: 'Triangle has 3 sides, square 4, pentagon 5.' },
      { prompt: 'Invert fill', display: ['●', '○', '■', '□', '◆', '?'], options: ['◇', '◆', '○', '■'], answer: 0, explanation: 'Each solid shape is followed by its outline.' },
      { prompt: 'Rotate 180°', display: ['◤', '↻↻', '?'], options: ['◥', '◣', '◢', '◤'], answer: 2, explanation: 'The filled corner moves to the opposite corner.' }
    ]
  }
}
