var fuzzySet = require('fuzzyset.js');
var removeAccents = require('./lib/removeAccents');

function FuzzyMatching(items) {
    var self = this;
    self.set = fuzzySet();
    self.itemMap = {};

    if (items) {
        items.forEach(function(item) {
            self.add(item);
        });
    }
}

FuzzyMatching.prototype.add = function(item) {
    var itemWithoutAccents = removeAccents(item);
    if (this.itemMap[itemWithoutAccents]) {
        return false;
    }
    if (this.set.add(itemWithoutAccents) !== false) {
        this.itemMap[itemWithoutAccents] = item;
        return true;
    }
    return false;
};

FuzzyMatching.prototype.get = function(item, criteria) {
    var res = this.getWithGrams(item, criteria);
    if (res) {
        // Return only the word
        return res[1];
    }
    return res;
};

FuzzyMatching.prototype.getWithGrams = function(item, criteria) {
    criteria = criteria || {};

    var res = this.set.get(item);
    if (res) {
        res = res[0];
        var grams = res[0];
        var withAccents = this.itemMap[res[1]];

        if (criteria && grams < criteria.min) {
            // Doesn't match minimum requirements --> Discard it
            return null;
        }
        return [grams, withAccents];
    }
    return res;
};

module.exports = FuzzyMatching;