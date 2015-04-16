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
    res = {
        distance: res[0][0],
        value: this.itemMap[res[0][1]]
    }

    // If it doesn't match requirements --> Consider not found
    if (criteria.min && res.distance < criteria.min) {
        return notFoundValue;
    } else if (criteria.maxChanges !== undefined && res.value.length && res.distance < 1 - (criteria.maxChanges / res.value.length)) {
        return notFoundValue;
    }
    return res;
};

module.exports = FuzzyMatching;