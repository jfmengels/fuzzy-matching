var expect = require('chai').expect;

var FuzzyMatching = require('..');

describe('fuzzy matching', function() {
    describe('#get', function() {
        var fm;

        before(function() {
            fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
        });

        it('should find words that are inside the dictionary', function() {
            expect(fm.get('tough')).to.equal('tough');
        });

        it('should find words that are spelled incorrectly', function() {
            expect(fm.get('thouhgt')).to.equal('thought');
        });

        it('should ignore case', function() {
            expect(fm.get('ThRouHg')).to.equal('through');
        });

        it('should ignore accents', function() {
            expect(fm.get('cafe')).to.equal('Café');
        });

        it('should not find words too remote to anything in the dictionary', function() {
            expect(fm.get('dinosaur')).to.be.null;
        });

        it('should return null when parameter is not a string', function() {
            expect(fm.get()).to.be.null;
            expect(fm.get(null)).to.be.null;
            expect(fm.get(['cafe'])).to.be.null;
            expect(fm.get({
                a: 1
            })).to.be.null;
        });
    });

    describe('#getWithGrams', function() {
        var fm;

        before(function() {
            fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
        });

        it('should return an array like [grams, word]', function() {
            var res = fm.getWithGrams('ThRouHg');
            expect(res).to.have.length(2);
            expect(res[0]).to.be.within(0, 1);
            expect(res[1]).to.equal('through');
        });

    });

    describe('gram criteria', function() {
        var fm, grams, wordToLookFor, wordExpected;

        before(function() {
            fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
            wordToLookFor = 'tour';
            wordExpected = 'tough';
            var res = fm.getWithGrams(wordToLookFor);
            grams = res[0];
            expect(res[1]).to.equal(wordExpected);
        });

        it('should refuse words when the number of grams is less than required', function() {
            var criteria = {
                min: grams + 0.1
            };
            expect(fm.get(wordToLookFor, criteria)).to.be.null;
            expect(fm.getWithGrams(wordToLookFor, criteria)).to.be.null;
        });

        it('should find words when the number of grams is more than required', function() {
            var criteria = {
                min: grams - 0.1
            };
            var res = fm.getWithGrams(wordToLookFor, criteria);
            expect(res).to.have.length(2);
            expect(res[0]).to.equal(grams, "grams should not have changed between two calls");
            expect(res[1]).to.equal(wordExpected, "resulting word should not have changed between two calls");
            expect(res[1]).to.equal(wordExpected, "resulting word should not have changed between two calls");
        });

        it('should find words when the number of grams is equal to minimum required', function() {
            var criteria = {
                min: grams
            };
            var res = fm.getWithGrams(wordToLookFor, criteria);
            expect(res).to.have.length(2);
            expect(res[0]).to.equal(grams, "grams should not have changed between two calls");
            expect(res[1]).to.equal(wordExpected, "resulting word should not have changed between two calls");
        });
    });

    describe('#add', function() {
        var fm;

        before(function() {
            fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
        });

        it('should find added words', function() {
            expect(fm.get('dinosaur')).to.be.null;
            fm.add('dinosaur');
            expect(fm.get('dinosaur')).to.equal('dinosaur');
        });

        it('should return true when adding a word', function() {
            expect(fm.add('newWord')).to.be.true;
        });

        it('should return false when adding a word already in the dictionary or close to one', function() {
            expect(fm.add('anotherWord')).to.be.true;
            expect(fm.add('anotherword')).to.be.false;
            expect(fm.add('anotherword')).to.be.false;
        });

        it('should return false when adding a word already in the dictionary or close to one', function() {
            expect(fm.add()).to.be.false;
            expect(fm.add(null)).to.be.false;
            expect(fm.add(['cafe'])).to.be.false;
            expect(fm.add({
                a: 1
            })).to.be.false;
        });
    });

    describe('internal workings', function() {
        it('two fuzzies should not share the same memory', function() {
            var fm1 = new FuzzyMatching(['a', 'b', 'c']);
            var fm2 = new FuzzyMatching();
            expect(fm1.itemMap).to.not.equal(fm2.itemMap);
        });
    });

    describe('README examples should work', function() {
        it('simple usage', function() {
            var fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
            expect(fm.get('tough')).to.equal('tough');
            expect(fm.get('thouhgt')).to.equal('thought');
            expect(fm.get('throught')).to.equal('through');
            expect(fm.get('ThRouHg')).to.equal('through');
            expect(fm.get('cafe')).to.equal('Café');

            expect(fm.get('dinosaur')).to.be.null;
            fm.add('dinosaur');
            expect(fm.get('dinosaur')).to.equal('dinosaur');
        });

        it('quizz', function() {
            var possibleAnswers = ['Jupiter', 'Mercury', 'Venus', 'Earth'],
                fm = new FuzzyMatching(possibleAnswers);

            var userAnswer = 'mercuyr';
            expect(fm.get(userAnswer, {
                min: 0.7
            })).to.equal('Mercury');
        });
    });
});