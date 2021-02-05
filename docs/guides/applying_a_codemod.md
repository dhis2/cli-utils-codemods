# Applying a codemod

There are two different ways to apply a codemod. It is possible to either
specify a specific codemod file or to specify a package and codemod name.

-   [Using a file](#using-a-file)
-   [Using a package and name](#using-a-package-and-name)

## Using a file

By supplying the path to the codemod as the first argument, you can apply said
codemod to the files specified in the second argument (or to all files in the
current working directory, if no files are specified). Files are
[`minimatch`](https://github.com/isaacs/minimatch) glob patterns:

```
d2-utils-codemods file/to/codemod.js src/**/*.js
```

## Using a package and name

Codemods included in a locally-installed package can be specified with a
special identifier syntax: The package name, followed by a `:`, followed by the
codemod name.

To find all the available codemods, you can use the list command:

```
d2-utils-codemods list
```

The above command will print all available codemods, like this:

```
@dhis2/cli-utils-cypress
* @dhis2/cypress-commands:replace-get-find-with-xxxxGetWithDataTest.js

@dhis2/d2
* @dhis2/d2:31.1.0-change-imports.js
```

You can then use the entire specifier to apply the codemod:

```
d2-utils-codemods @dhis2/d2:31.1.0-change-imports.js src/
```
