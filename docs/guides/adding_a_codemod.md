# Adding a codemod

If you need to add a discoverable codemod, then you need to

1. figure out the correct repository<br />
   If you want to provide a codemod for the `app-runtime` library, then the
   library's repository is the correct location
1. put the file into a `codemods` folder on the root level<br />
   If the repository is a monorepo, make sure to put the folder into the root
   folder of the specific workspace as it wouldn't be published otherwise

Currently we only support library's that are within the `@dhis2` namespace,
such as `@dhis2/cli-utils-cypress` or `@dhis2/ui-core`
