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

FuzzyMatching.prototype.get = function(item) {
    var res = this.set.get(item);
    if (res) {
        res = res[0];
        // Get back accentuated item
        return this.itemMap[res[1]];
    }
    return res;
};

module.exports = FuzzyMatching;