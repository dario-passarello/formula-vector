module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "prettier"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": ["./tsconfig.json"]
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "@typescript-eslint/explicit-function-return-type": "warn",  // Adjust to "off" if you prefer
        "@typescript-eslint/no-unused-vars": "warn",
        "prettier/prettier": "warn",
        "@typescript-eslint/restrict-template-expressions": "off",  // Adjust to "warn" if you prefer
        "@typescript-eslint/strict-boolean-expressions": "off",     // Adjust to "warn" if you prefer
        "spaced_comment": "off"
    }
}
