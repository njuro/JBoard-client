module.exports = {
  extends: ["airbnb-typescript-prettier", "plugin:import/typescript"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "react/jsx-props-no-spreading": 0,
    "react/require-default-props": 0,
    "import/no-cycle": 0,
    "no-plusplus": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/media-has-caption": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "import/no-extraneous-dependencies": 1,
    "import/no-unresolved": 1,
  },
};
