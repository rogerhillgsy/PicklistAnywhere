module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.(j|t)sx?$": "ts-jest"
  },
  transformIgnorePatterns: ["/node_modules/(?!office-ui-fabric-react)"]
};