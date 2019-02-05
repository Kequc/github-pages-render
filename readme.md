# Github pages render

Command line tool for rendering a docs folder in your repository for use with github pages. Pairs highlight.js, mustache, and markdown.

### Install

```
npm i -g github-pages-render
```

Add the following scripts to `package.json` for easy access:

```javascript
{
    "scripts": {
        "docs": "github-pages-render",
        "docs:server": "github-pages-render server"
    }
}
```

### Params

The `dir` parameter is optional in all cases defaulting to the current directory, it should be the root of your project.

### Init

To initialise your project, run `github-pages-render [-f] init [dir]`. This will add all of the scaffolding files to your project. To remove existing files and folders first use the `-f` flag, this will essentially run `remove` as described below.

### Remove

If you want to remove existing files and folders related to this library,  run `github-pages-render remove [dir]`. It will ask you if you want to delete each existing item.

### Server

To preview your docs directory run `github-pages-render server [dir]`, this will start a very simple server on port `8080` (by default). So that you can preview what the finished product will look like on Github pages.

### Render

To render your docs directory contents from markdown run `github-pages-render [dir]`. All existing contents with exception of the `assets` folder and any defined important files, will be deleted and new ones put in their place.

### github-pages.json

The configuration file resides at the base of your project directory and contains the following options.

| name | option | default | description |
| - | - | - | - |
| outputDir | `-o` | `"docs"` | Your target directory |
| templateDir | `-t` | `"docs-template"` | Your source template directory |
| mdDir | `-m` | `"docs-md"` | Your source markdown directory |
| readme | `-r` | `"readme.md"` | Your source readme (index.html) file |
| important | - | `["CNAME"]` | Any files or folders in your target directory which are special and should not be overwritten |
| templates | - | `{}` | If you have more than one template specify them by name and an array of the markdown files that should use it |
| view | - | `{}` | Any additional view attributes you want available in your templates |
| port | `-p` | `8080` | The port that should be used when running the server |
| repo | - | `` | This is advertising |

### Templates

All of your templates should exist at the base of the templates directory. You can have as many as you like and specify them in the templates config object as follows (`/my-project/docs-template/simple.mustache`):

```javascript
{
    "simple": ["about-page.md", "other/contact.md"]
}
```

The default template is `index.mustache` and should have been created for you. Similarly you should see some basic partials that are missing a few details, for example your `/partials/sidebar.mustache` is a sidebar with a few bad defaults.

You may also add as many partials of your own as you want. You will need to run `render` again when you change your template files.

### Markdown files

Write your markdown files as though they are meant to be used on Github, for example write your links so that they will work on Github (ie. `docs-md/example.md`) and they should link as you expect in your rendered pages. You may use any folder structure within your source markdown directory as you want.

You will need to run `render` again when you change your markdown files.

### Assets

To make changes to your css, images, or javascript. Add or modify those assets into your output assets directory directly. They will be safe from deletion as long as you don't use the `-f` flag and then also say that you want to delete your output directory.

### Publish

To publish, just push to Github and use [Github Pages](https://pages.github.com/) set it to render from the `docs` directory.
