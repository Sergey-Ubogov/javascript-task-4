'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

function getCopyCollection(collection) {
    return collection.map(function (friend) {
        var copyFriend = {};
        for (var field in friend) {
            if (friend.hasOwnProperty(field)) {
                copyFriend[field] = friend[field];
            }
        }

        return copyFriend;
    });
}


/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var copyCollection = getCopyCollection(collection);
    var functions = [].slice.call(arguments).slice(1);
    var priorityFunctions = ['filterIn', 'and', 'or', 'sortBy', 'select', 'format', 'limit'];
    functions.sort(function (functionOne, functionTwo) {
        return priorityFunctions.indexOf(functionOne.name) -
        priorityFunctions.indexOf(functionTwo.name);
    });
    functions.forEach(function (func) {
        copyCollection = func(copyCollection);
    });

    return copyCollection;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var selectFields = Array.from(arguments);

    return function select(collection) {
        return collection.map(function (friend) {
            var requiredFields = {};
            selectFields.forEach(function (field) {
                if (friend.hasOwnProperty(field)) {
                    requiredFields[field] = friend[field];
                }
            });

            return requiredFields;
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    console.info(property, values);

    return function filterIn(collection) {
        return collection.filter(function (friend) {
            return values.indexOf(friend[property]) !== -1;
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        return collection.sort(function (friendOne, friendTwo) {
            var ord = order === 'asc' ? 1 : -1;
            if (friendOne[property] > friendTwo[property]) {
                return ord;
            }
            if (friendOne[property] < friendTwo[property]) {
                return -ord;
            }

            return 0;
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    console.info(property, formatter);

    return function format(collection) {
        return collection.map(function (friend) {
            friend[property] = formatter(friend[property]);

            return friend;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    console.info(count);

    return function limit(collection) {
        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function}
     */
    exports.or = function () {
        var filters = [].slice.call(arguments);

        return function or(collection) {
            return collection.filter(function (friend) {
                return filters.some(function (filter) {
                    return filter(collection).indexOf(friend) !== -1;
                });
            });
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function}
     */
    exports.and = function () {
        var filters = [].slice.call(arguments);

        return function and(collection) {
            return collection.filter(function (friend) {
                return filters.every(function (filter) {
                    return filter(collection).indexOf(friend) !== -1;
                });
            });
        };
    };
}
