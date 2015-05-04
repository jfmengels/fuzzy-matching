# fuzzy-matching
[![NPM version](http://img.shields.io/npm/v/fuzzy-matching.svg?style=flat)](https://www.npmjs.com/package/fuzzy-matching)
[![Build Status](https://travis-ci.org/jfmengels/fuzzy-matching.png)](https://travis-ci.org/jfmengels/fuzzy-matching)
[![Dependencies Status](http://img.shields.io/david/jfmengels/fuzzy-matching.svg?style=flat)](https://david-dm.org/jfmengels/fuzzy-matching#info=dependencies)
[![devDependencies Status](http://img.shields.io/david/dev/jfmengels/fuzzy-matching.svg?style=flat)](https://david-dm.org/jfmengels/fuzzy-matching#info=devDependencies)

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
console.log(fm.get('tough')); // --> { distance: 1, value: 'tough' }

// Finds words that are spelled wrong by looking at the closest ressembling word
console.log(fm.get('thouhgt')); // --> { distance: 0.7142857142857143, value: 'thought' }
// Beware when words in your dictionary are very close
console.log(fm.get('throught')); // --> { distance: 0.875, value: 'through' },
                                 // though you may have wanted to get 'thought'

// Case insensitive
console.log(fm.get('ThRouHg').value); // --> through

// Accent-proof
console.log(fm.get('cafe').value); // --> Café

// Add words after creation
console.log(fm.get('dinosaur')); // --> { distance: 0, value: null }
                                // because too remote to anything in the dictionary
fm.add('dinosaur');
console.log(fm.get('dinosaur')); // --> { distance: 1, value: 'dinosaur' }

// Want to limit to a certain degree of resemblance?
console.log(fm.get('touch', { maxChanges: 0 }).value); // --> null
console.log(fm.get('touch', { maxChanges: 1 }).value); // --> tough
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
var correctedAnswer = fm.get(userAnswer, { maxChanges: 2 }).value;
if (answer === correctedAnswer) {
    console.log('That\'s right!, it\'s ' + answer + '!');
} else {
    console.log('Sorry buddy, the answer was ' + answer + '.');
}
```

