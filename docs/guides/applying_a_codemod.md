# Applying a codemod

There are two different ways to apply a codemod. Either by using a file or by
specifying a package and codemod name.

-   [Using a file](#using-a-file)
-   [Using a package and name](#using-a-package-and-name)

## Using a file

By supplying the path to the codemod as the first argument, you can apply said
codemod to the files specified in the second argument (or to all files in the
cwd, which is the default value for the files):

```
d2-utils-codemods file/to/codemod.js src/**/*.js
```

## Using a package and name

If one of the dhis2 packages, that you have installed, contains a codemod, you
can use it by using the special identifier syntax: The package name, followed
by a colon symbol, followed by the codemod name.

To find all the available codemods, you can use the list command:

```
d2-utils-codemods list
```

The above command will print all available codemods, e. g. like this:

```
@dhis2/cli-utils-cypress
* @dhis2/cypress-commands:replace-get-find-with-xxxxGetWithDataTest.js

@dhis2/d2
* @dhis2/d2:31.1.0-change-imports.js
```

You can then use the entire specifier to define the codemod that should be
applied:

```
d2-utils-codemods @dhis2/d2:31.1.0-change-imports.js src/
```
