var expect = require("chai").expect;

var FuzzyLanguage = require("..");

describe('fuzzy matching', function() {
    it('two fuzzies should not share the same memory', function() {
    	var fl1 = new FuzzyLanguage(['a', 'b', 'c']);
    	var fl2 = new FuzzyLanguage();
    	expect(fl1.itemMap).to.not.equal(fl2);
    });
});