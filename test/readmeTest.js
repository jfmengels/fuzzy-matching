var expect = require('chai').expect;

var FuzzyMatching = require('..');

describe('README examples should work', function() {
    it('simple usage', function() {
        var fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
        expect(fm.get('tough')).to.deep.equal({
            distance: 1,
            value: 'tough'
        });

        expect(fm.get('thouhgt')).to.deep.equal({
            distance: 0.7142857142857143,
            value: 'thought'
        });

        expect(fm.get('throught')).to.deep.equal({
            distance: 0.875,
            value: 'through'
        });

        expect(fm.get('ThRouHg').value).to.equal('through');

        expect(fm.get('cafe')).to.deep.equal({
            distance: 1,
            value: 'Café'
        });

        expect(fm.get('dinosaur')).to.deep.equal({
            distance: 0,
            value: null
        });
        fm.add('dinosaur');
        expect(fm.get('dinosaur')).to.deep.equal({
            distance: 1,
            value: 'dinosaur'
        });

        expect(fm.get('touch')).to.deep.equal({
            distance: 0.8,
            value: 'tough'
        });

        expect(fm.get('touch', {
            maxChanges: 0
        })).to.deep.equal({
            distance: 0,
            value: null
        });

        expect(fm.get('touch', {
            maxChanges: 1
        })).to.deep.equal({
            distance: 0.8,
            value: 'tough'
        });
    });

    it('quizz', function() {
        var possibleAnswers = ['Jupiter', 'Mercury', 'Venus', 'Earth'],
            fm = new FuzzyMatching(possibleAnswers);

        var userAnswer = 'mercuyr';
        var res = fm.get(userAnswer, {
            maxChanges: 2
        });
        expect(res.value).to.equal('Mercury');
    });
});
