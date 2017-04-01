gulp-link-imports [![NPM version](https://badge.fury.io/js/link-imports.svg)](https://npmjs.org/package/gulp-link-imports) [![Build Status](https://travis-ci.org/kristianmandrup/gulp-link-imports.svg?branch=master)](https://travis-ci.org/kristianmandrup/gulp-link-imports) [![Dependency Status](https://david-dm.org/kristianmandrup/gulp-link-imports.svg?theme=shields.io)](https://david-dm.org/kristianmandrup/gulp-link-imports)
============================================================================================================================================================================================================================================================================================================================================================================================================================================

[![Greenkeeper badge](https://badges.greenkeeper.io/kristianmandrup/gulp-link-imports.svg)](https://greenkeeper.io/)

> Gulp plugin to generate link imports for Polymer Web Components

Install
-------

```sh
$ npm install --save gulp-link-imports
```

Usage
-----

Example: Use in a project created via [Polymer starter kit](https://developers.google.com/web/tools/polymer-starter-kit/).

In `app/elements` create a folder `imports`. In the `imports` folder, create subfolders `external` and `app`. Now create yml files such as `app.yml`, `paper.yml` etc.

```
/app
  /elements
    /imports
      /app
        app.yml
      /external
        paper.yml
        iron.yml
        ...
```

### Import lists

Create one file per catalog of components that you use.

An item without `-` such as `fab`, will be expanded to `paper-fab`, using the name of the file. An item starting with `:` will be forced to expand, even if it has a `-`.

An item without a folder `/`, such as `paper-fab` will be expanded to the full form: `paper-fab/paper-fab`.

Finally each item will be postfixed with `.html` to `paper-fab/paper-fab.html` before being decorated as:

```html
<link rel="import" href="../bower_components/paper-fab/paper-fab.html"/>
```

`paper.yml`

```yaml
- :scroll-header-panel
- :drawer-panel
- :icon-button
- fab
- item
- material
- menu
- paper-styles/paper-styles-classes
```

`iron.yml`

```yaml

- form
- collapse
- iron-flex-layout/classes/iron-flex-layout
- iron-icons/social-icons
```

### Gulp tasks

Configure tasks in your `gulpfile.js`

```js
var linkImports = require('gulp-link-imports');

gulp.task('import:external', function () {
  gulp.src('./app/elements/imports/external/**/*.yml')
    // .pipe(printFile())
    .pipe(linkImports({external: true}))
    .pipe(fs.createWriteStream('./app/elements/external-imports.html'));
});

gulp.task('import:app', function () {
  gulp.src('./app/elements/imports/app/**/*.yml')
    // .pipe(printFile())
    .pipe(linkImports({app: true}))
    .pipe(fs.createWriteStream('./app/elements/app-imports.html'));
});

gulp.task('imports', ['import:external', 'import:app']);
```

License
-------

MIT © [Kristian Mandrup]()
