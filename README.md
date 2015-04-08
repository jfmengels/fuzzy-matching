# fuzzy-matching
Fuzzy string matcher

## Installation

```
npm install fuzzy-matching
```

## Code sample

```js
var fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);

// Finds words
console.log(fm.get('tough')); // --> tough

// Finds words that are spelled wrong by looking at the closest ressembling word
console.log(fm.get('thouhgt')); // --> thought
// Beware when words in your dictionary are very close
console.log(fm.get('throught')); // --> through, though you may have wanted to get 'thought'

// Case insensitive
console.log(fm.get('ThRouHg')); // --> through

// Accent-proof
console.log(fm.get('cafe')); // --> Café
```

### Use case: quizzes or user inputs with certain expected answers
```js
var possibleAnswers = ['Jupiter', 'Mercury', 'Venus', 'Earth'],
    fm = new FuzzyMatching(possibleAnswers),
    answer = 'Mercury';

console.log('Which planet is the closest to the Sun: ' + possibleAnswers.join(', ') + '?');

// Some user stuff...

var userAnswer = 'mercuyr';
var correctedAnswer = fm.get(userAnswer);
if (answer === correctedAnswer) {
    console.log('That\'s right!, it\'s ' + answer + '!');
} else {
    console.log('Sorry buddy, the answer was ' + answer);
}
```

