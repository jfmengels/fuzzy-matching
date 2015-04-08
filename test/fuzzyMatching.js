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
            fm.add('anotherWord');
            expect(fm.add('anotherWord')).to.be.false;
            expect(fm.add('anotherword')).to.be.false;
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
            expect(fm.get(userAnswer)).to.equal('Mercury');
        });
    });
});