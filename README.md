# graphql-file-system-access

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test graphql-file-system-access` to execute the unit tests via [Jest](https://jestjs.io).

embedding:

/workspace.json #projects

```
  "root": #"libs/graphql/file-system-access"
```

```
  "sourceRoot": "libs/graphql/file-system-access/src
```

```
"graphql-file-system-access": {
      "root": path/to/lib,
      "sourceRoot": path/to/lib/src,
      "projectType": "library",
      "schematics": {},
      "architect": {
        "lint": {
          "builder": "@nrwl/linter:eslint",
          "options": {
            "lintFilePatterns": ["libs/graphql/file-system-access/**/*.{ts,tsx,js,jsx}"]
          }
        },
        "build": {
          "builder": "@nrwl/web:package",
          "options": {
            "outputPath": "dist/libs/graphql/file-system-access",
            "tsConfig": "libs/graphql/file-system-access/tsconfig.lib.json",
            "project": "libs/graphql/file-system-access/package.json",
            "entryFile": "libs/graphql/file-system-access/src/index.ts",
            "external": ["react", "react-dom"],
            "babelConfig": "@nrwl/react/plugins/bundle-babel",
            "rollupConfig": "@nrwl/react/plugins/bundle-rollup",
            "assets": [
              {
                "glob": "README.md",
                "input": ".",
                "output": "."
              }
            ]
          }
        },
        "test": {
          "builder": "@nrwl/jest:jest",
          "options": {
            "jestConfig": "libs/graphql/file-system-access/jest.config.js",
            "passWithNoTests": true
          }
        }
      }
    },
```
