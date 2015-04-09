# fuzzy-matching
Fuzzy string matcher

## Installation

```
npm install fuzzy-matching
```

## Code sample

```js
var FuzzyMatching = require('fuzzy-matching');

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

// Add words after creation
console.log(fm.get('dinosaur')); // --> null, because too remote to anything in the dictionary
fm.add('dinosaur');
console.log(fm.get('dinosaur')); // --> dinosaur

// Do you want to see the degree of resemblance?
console.log(fm.getWithGrams('touch')); // --> [ 0.8, 'tough' ] = [degree of resemblance i.e. "grams", fm.get('touch')]

// Want to limit to a certain degree of resemblance?
console.log(fm.getWithGrams('touch', { min: 0.9 })); // --> null
console.log(fm.getWithGrams('touch', { min: 0.7 })); // --> [ 0.8, 'tough' ]
// Available with a simple get too
console.log(fm.get('touch', { min: 0.7 })); // --> 'tough'
```

### Use case: quizzes or user inputs with certain expected answers
```js
var FuzzyMatching = require('fuzzy-matching');

var possibleAnswers = ['Jupiter', 'Mercury', 'Venus', 'Earth'],
    fm = new FuzzyMatching(possibleAnswers),
    answer = 'Mercury';

console.log('Which planet is the closest to the Sun: ' + possibleAnswers.join(', ') + '?');

// Some user stuff...

var userAnswer = 'mercuyr';
var correctedAnswer = fm.get(userAnswer, { min: 0.7 });
if (answer === correctedAnswer) {
    console.log('That\'s right!, it\'s ' + answer + '!');
} else {
    console.log('Sorry buddy, the answer was ' + answer + '.');
}
```

