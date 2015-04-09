var expect = require('chai').expect;

var FuzzyMatching = require('..');

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

        expect(fm.getWithGrams('touch')).to.deep.equals([ 0.8, 'tough' ]);

        // Want to limit to a certain degree of resemblance?
        expect(fm.getWithGrams('touch', { min: 0.9 })).to.equal(null);
        expect(fm.getWithGrams('touch', { min: 0.7 })).to.deep.equals([ 0.8, 'tough' ]);
        // Available with a simple get too
        expect(fm.get('touch', { min: 0.7 })).to.equal('tough');
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