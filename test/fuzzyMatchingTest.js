var expect = require('chai').expect;

var FuzzyMatching = require('..');

var nullValue = {
    distance: 0,
    value: null
};

describe('fuzzy matching', function() {
    describe('#get', function() {
        var fm;

        before(function() {
            fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
        });

        it('should find words that are inside the dictionary', function() {
            var res = fm.get('tough');
            expect(res).to.be.a('object');
            expect(res.distance).to.be.within(0, 1);
            expect(res.value).to.equal('tough');
        });

        it('should find words that are spelled incorrectly', function() {
            var res = fm.get('thouhgt');
            expect(res).to.be.a('object');
            expect(res.distance).to.be.within(0, 1);
            expect(res.value).to.equal('thought');
        });

        it('should ignore case', function() {
            var res = fm.get('ThRouHg');
            expect(res).to.be.a('object');
            expect(res.distance).to.be.within(0, 1);
            expect(res.value).to.equal('through');
        });

        it('should ignore accents', function() {
            var res = fm.get('cafe');
            expect(res).to.be.a('object');
            expect(res.distance).to.be.within(0, 1);
            expect(res.value).to.equal('Café');
        });

        it('should not find words too remote to anything in the dictionary', function() {
            expect(fm.get('dinosaur')).to.deep.equal(nullValue);
        });

        it('should return null when parameter is not a string', function() {
            expect(fm.get()).to.deep.equal(nullValue);
            expect(fm.get(null)).to.deep.equal(nullValue);
            expect(fm.get(['cafe'])).to.deep.equal(nullValue);
            expect(fm.get({
                a: 1
            })).to.deep.equal(nullValue);
        });

        describe('distance values', function() {
            it('should equal 1 when strings match exactly', function() {
                var fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
                var res = fm.get('Café');
                expect(res).to.be.a('object');
                expect(res.distance).to.equal(1);
                expect(res.value).to.equal('Café');
            });

            it('should equal 1 when complex strings match exactly', function() {
                var value = 'Un terme mathématique (Googol), qui désigne 1 nombre commençant par “1” suivi de 100 zéros';
                var fm = new FuzzyMatching([value]);
                var res = fm.get(value);
                expect(res).to.be.a('object');
                expect(res.distance).to.equal(1);
                expect(res.value).to.equal(value);
            });

            it('should be the same when you invert searched and found word', function() {
                var value1 = 'tour',
                    value2 = 'toure';

                var fm1 = new FuzzyMatching([value1]);
                var res1 = fm1.get(value2);
                expect(res1).to.be.a('object');
                expect(res1.value).to.equal(value1);

                var fm2 = new FuzzyMatching([value2]);
                var res2 = fm2.get(value1);
                expect(res2).to.be.a('object');
                expect(res2.value).to.equal(value2);

                expect(res1.distance).to.equal(res2.distance);
                expect(res1.distance).to.be.within(0, 1);
                expect(res2.distance).to.be.within(0, 1);
            });
        });
    });

    describe('distance criteria', function() {
        describe('min', function() {
            var fm, wordToLookFor, reference;

            before(function() {
                fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
                wordToLookFor = 'tour';
                reference = fm.get(wordToLookFor);
                expect(reference).to.be.a('object');
                expect(reference.distance).to.be.within(0, 1);
                expect(reference.value).to.equal('tough');
            });

            it('should refuse words when the distance is less than required', function() {
                var criteria = {
                    min: reference.distance + 0.1
                };
                expect(fm.get(wordToLookFor, criteria)).to.deep.equal(nullValue);
            });

            it('should find words when the distance is more than required', function() {
                var criteria = {
                    min: reference.distance - 0.1
                };
                var res = fm.get(wordToLookFor, criteria);
                expect(res).to.be.a('object');
                expect(res.distance).to.equal(reference.distance, "distance should not have changed between two calls");
                expect(res.value).to.equal(reference.value, "resulting word should not have changed between two calls");
            });

            it('should find words when the distance is equal to minimum required', function() {
                var criteria = {
                    min: reference.distance
                };
                var res = fm.get(wordToLookFor, criteria);
                expect(res).to.be.a('object');
                expect(res.distance).to.equal(reference.distance, "distance should not have changed between two calls");
                expect(res.value).to.equal(reference.value, "resulting word should not have changed between two calls");
            });
        });

        describe('maxChanges', function() {
            var fm;

            before(function() {
                fm = new FuzzyMatching(['tough', 'Café', 'dinosaur']);
            });

            it('should refuse words when the distance is less than required', function() {
                expect(fm.get('toug', {
                    maxChanges: 0
                })).to.deep.equal(nullValue);

                expect(fm.get('dinsorau', {
                    maxChanges: 2
                })).to.deep.equal(nullValue);
            });

            it('should find words when the distance is more than or equal to required', function() {
                expect(fm.get('toug', {
                    maxChanges: 1
                }).value).to.equal('tough');

                expect(fm.get('dinosrau', {
                    maxChanges: 3
                }).value).to.equal('dinosaur');
            });
        });
    });

    describe('#add', function() {
        var fm;

        before(function() {
            fm = new FuzzyMatching(['tough', 'thought', 'through', 'Café']);
        });

        it('should find added words', function() {
            expect(fm.get('dinosaur')).to.deep.equal(nullValue);
            fm.add('dinosaur');
            expect(fm.get('dinosaur')).to.deep.equal({
                distance: 1,
                value: 'dinosaur'
            });
        });

        it('should return true when adding a word', function() {
            expect(fm.add('newWord')).to.be.true;
        });

        it('should return false when adding a word already in the dictionary or close to one', function() {
            expect(fm.add('anotherWord')).to.be.true;
            expect(fm.add('anotherword')).to.be.false;
            expect(fm.add('anotherword')).to.be.false;
        });

        it('should return false when adding a non-string item', function() {
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
});