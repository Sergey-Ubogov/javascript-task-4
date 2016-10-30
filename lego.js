'use strict';

exports.isStar = false;

function getCopyCollection(collection) {
    var copyCollection = [];
    collection.forEach(function (friend) {
        var copyFriend = {};
        for (var field in friend) {
            if (friend.hasOwnProperty(field)) {
                copyFriend[field] = friend[field];
            }
        }
        copyCollection.push(copyFriend);
    });

    return copyCollection;
}


/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var copyCollection = getCopyCollection(collection);
    var functions = [];
    for (var i = 1; i < arguments.length; i++) {
        functions.push(arguments[i]);
    }
    var priorityFunctions = ['filterIn', 'sortBy', 'select', 'format', 'limit'];
    functions.sort(function (functionOne, functionTwo) {
        return priorityFunctions.indexOf(functionOne.name) -
        priorityFunctions.indexOf(functionTwo.name);
    });
    //  console.info(functions);
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
    var selectFields = [];
    for (var i = 0; i < arguments.length; i++) {
        selectFields.push(arguments[i]);
    }

    return function select() {
        return arguments[0].map(function (friend) {
            var requiredFields = {};
            selectFields.forEach(function (field) {
                requiredFields[field] = friend[field];
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

    return function filterIn() {
        var filteredList = [];
        getCopyCollection(arguments[0]).forEach(function (friend) {
            values.forEach(function (value) {
                if (friend[property] === value) {
                    filteredList.push(friend);
                }
            });
        });

        return filteredList;
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    console.info(property, order);

    return function sortBy() {
        return getCopyCollection(arguments[0]).sort(function (friendOne, friendTwo) {
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

    return function format() {
        return getCopyCollection(arguments[0]).map(function (friend) {
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

    return function limit() {
        return getCopyCollection(arguments[0]).slice(0, count);
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}