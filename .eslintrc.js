module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
    },
    "extends": ["gbv"],
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2017
    },
    "rules": {
        // Disable comma-dangle enforcement due to older JavaScript version
        "comma-dangle": ["error", "never"],
        // Disable no-undef due to usage of custom global variables in WinIBW
        "no-undef": "off",
    }
};
