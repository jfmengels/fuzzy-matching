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
    if (typeof item !== 'string') {
        return false;
    }
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
    var notFoundValue = {
        distance: 0,
        value: null
    };
    if (typeof item !== 'string') {
        return notFoundValue;
    }
    criteria = criteria || {};

    var res = this.set.get(removeAccents(item));
    if (!res) {
        return notFoundValue;
    }

    res = res[0];
    if (criteria.min && res[0] < criteria.min) {
        // If it doesn't match minimum requirements --> Consider not found
        return notFoundValue;
    }

    return {
        distance: res[0],
        value: this.itemMap[res[1]]
    };
};

module.exports = FuzzyMatching;