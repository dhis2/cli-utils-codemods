# Listing available codemods

The individual items of the result list that will be printed when using this
command can be copied and used directly in the apply command (without the
leading asterix and space).

-   [Copying the output for the apply
    command](#copying-the-output-for-the-apply-command)
-   [Listing all available codemods](#listing-all-available-codemods)
-   [Listing all codemods of a specific
    package](#listing-all-codemods-of-a-specific-package)
-   [Filtering the codemods by name](#filtering-the-codemods-by-name)

## Copying the output for the apply command

If the output contains the following:

```
@dhis2/d2
* @dhis2/d2:31.1.0-change-imports.js
```

Then `@dhis2/d2:31.1.0-change-imports.js` is a valid codemod specifier which
can be applied like this:

```
d2-utils-codemods apply @dhis2/d2:31.1.0-change-imports.js
```

## Listing all available codemods

The `list` command will list all available codemods:

```
d2-utils-codemods list
```

This will print all available codemods, like this:

```
@dhis2/cli-utils-cypress
* @dhis2/cypress-commands:replace-get-find-with-xxxxGetWithDataTest.js

@dhis2/d2
* @dhis2/d2:31.1.0-change-imports.js
```

## Listing all codemods of a specific package

You can also list all available codemods for a specific package by providing
the package's name:

```
d2-utils-codemods list @dhis2/d2
```

The above command will print all available codemods, like this:

```
@dhis2/d2
* @dhis2/d2:31.1.0-change-imports.js
```

## Filtering the codemods by name

You can search the codemods by providing the `--name <searchKey>` argument. It
will find all codemods which contain the specified `searchKey` in their names.

```
d2-utils-codemods list --name change
```

The above command will print all available codemods, like this:

```
@dhis2/d2-ui
* @dhis2/d2-ui:change-imports.js

@dhis2/d2
* @dhis2/d2:31.1.0-change-imports.js
```

You can also use this together with a package name:

```
d2-utils-codemods list d2 --name change
```

```
@dhis2/d2
* @dhis2/d2:31.1.0-change-imports.js
```
