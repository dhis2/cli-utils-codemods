# Codemods for d2

## v31.1.0

### New import path

Old:

```
import d2 from 'd2/lib/d2'
```

New:

```
import d2 from 'd2'
```

Run the codemod:

```
jscodeshift -t ./change-imports.js /path/to/app/src
```
