# Adding a codemod

If you need to add a discoverable codemod, then you need to

1. determine the correct repository<br />
   If you want to provide a codemod for the `app-runtime` library, then the
   library's repository is the correct location
1. put the file into a `codemods` folder at the root level of the package<br />
   If the repository is a monorepo, make sure to put the folder into the root
   folder of the specific workspace otherwise it will not be published
1. ensure that the `codemods` folder is published to `npm` with the
   package<br/> The `files` list in `package.json` must include `codemods`, and
   it should not be excluded by `.npmignore`

The following directories will be searched:

-   `${NODE_MODULES}/{{folder}}/codemods/`
-   `${NODE_MODULES}/{{namespace}}/{{folder}}/codemods/`
