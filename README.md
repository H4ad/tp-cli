<h1 align="center">
  Template (TP) CLI
</h1>

<p align="center">
  A stupid simple way to generate and share template files locally and with your team.
</p>

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

Think in this CLI like `@angular/schematics` but way more simpler to configure and use.

If you work on a project that needs to generate a lot of boilerplate code, like when you work with `NestJS` APIs,
instead use `nest g controller cat` and modify the contents to add authentication and other boilerplate code, just create a template for that project
and customize it to your needs, then you can just generate with `tp g controller cat`.

# Usage

First, install the CLI with:

```bash
npm i -g @h4ad/tp-cli
```

Then, start your first template with:

```bash
tp start my-template
```

This will create a simple template configuration, to be able to use, first let's make this template accessible via the CLI in this folder by running:

```bash
tp local my-template
```

> This will create a file called `.tp.yml` in your repository, you can commit this file so you can share this template with others.

So, let's see the resources available in this template:

```bash
tp ls
```

You will see a command called `setup`, to use it, just run:

```
tp g setup cats
```

In this point, `tp` will look at your template's configuration looking for how to generate the `setup`, then it will generate the resource and change all [wildcards](#wildcards) to the name you passed, which is `cats`.

Now, you will see some files in your current folder:

- `cats.api.js`
- `index.js`
- `README.md`

That's it!

# Creating Templates

The template file configuration looks like this:

```yaml
# the description that will be shown during "tp list"
description: "My simple template"

# Where we can get this template
# installUrl: https://gist.github.com/blablabla

# commands that will be read by tp
generate:
  # name of your resource
  # this will be exposed like: tp generate setup <name>
  setup:
    description: "Initialize the API with some files"
    structure:
      # inside your resource, you can specificy which files will be created
      # it will be relative to the CLI, and you can specificy sub-folders by just putting folder/file
      src/index.js:
        content: |-
          console.log('Potato');
      README.md:
        content: |-
          # Hello world
  controller:
    description: "Create a controller file"
    structure:
      src/$PARAM_SINGULAR_NAME$.controller.js:
        content: |-
          // put the code you want
```

To customize the previously created template, you can run:

```bash
tp open my-template
```

Then, edit the `tp.yml` with the boilerplate that you need and just save the file.
By saving the file, you already can use the resources that you have added in any project you want.

> Don't forget to run `tp local my-template` after making changes if you haven't published your template somewhere.

## Wildcards

With wildcards you can customize the way you output your files, if you need the name to be pascal case you can use wildcards.

> Terrible name by the way but I couldn't think of anything better.

Well, let's imagine that we generate two resources with the names `cats` and `cat-owners`, then we will have:

- `$NAME$`: `cats` and `cat owners`
- `$PASCAL_SINGULAR_NAME$`: `Cat` and `CatOwner`
- `$PARAM_SINGULAR_NAME$`: `cat` and `cat-owner`
- `$CAMEL_SINGULAR_NAME$`: `cat` and `catOwner`
- `$CAPITAL_SINGULAR_NAME$`: `Cat` and `Cat Owner`
- `$CONSTANT_SINGULAR_NAME$`: `CAT` and `CAT_OWNER`
- `$HEADER_SINGULAR_NAME$`: `Cat` and `Cat-Owner`
- `$DOT_SINGULAR_NAME$`: `cat` and `cat.owner`
- `$PATH_SINGULAR_NAME$`: `cat` and `cat/owner`
- `$SNAKE_SINGULAR_NAME$`: `cat` and `cat_owner`
- `$PASCAL_PLURAL_NAME$`: `Cats` and `Cat Owners`
- `$PARAM_PLURAL_NAME$`: `cats` and `cat-owners`
- `$CAMEL_PLURAL_NAME$`: `cats` and `catOwners`
- `$CAPITAL_PLURAL_NAME$`: `Cats` and `Cats Owners`
- `$CONSTANT_PLURAL_NAME$`: `CATS` and `CATS_OWNERS`
- `$HEADER_PLURAL_NAME$`: `Cats` and `Cats-Owners`
- `$DOT_PLURAL_NAME$`: `cats` and `cats.owners`
- `$PATH_PLURAL_NAME$`: `cats` and `cats/owners`
- `$SNAKE_PLURAL_NAME$`: `cats` and `cats_owners`
- `$PASCAL_NAME$`: `Cats` and `CatOwners`
- `$PARAM_NAME$`: `cats` and `cat owners`
- `$CAMEL_NAME$`: `cats` and `catOwners`
- `$CAPITAL_NAME$`: `Cat` and `Cat Owners`
- `$CONSTANT_NAME$`: `CAT` and `CAT_OWNERS`
- `$HEADER_NAME$`: `Cat` and `Cat-Owners`
- `$DOT_NAME$`: `Cat` and `Cat-Owners`
- `$PATH_NAME$`: `cat` and `cat/owners`
- `$SNAKE_NAME$`: `cat` and `cat_owners`

You can use those wildcards in `filename` and within `content`, so with those wildcards, I think it will cover almost all your cases.

## Examples

Below, some examples files that you can use to get inspiration to create your own templates:

- [TP-CLI](./examples/tp.yml): To generate new commands for this CLI.
- [NestJS Rest Template](./examples/nestjs.yml): With `service`, `controller` and `resource`.

# Saving Local and Restoring Templates

In order to be able to share the templates with your team, I create two commands:

- `tp local <template>`: To save `<template>` inside the current folder, I'll create a file called `.tp.yml`.
- `tp restore`: Read `.tp.yml` to learn to bootstrap the templates.

If you created the template using `tp create` and didn't host it anywhere, when you call `tp local <template>` it will copy the entire template to `.tp.yml`.

When you set `installUrl` inside the template, it will just copy `installUrl` to `.tp.yml` so that you can update that template without having to modify `.tp.yml`.

Also, you can force copy the entire template by passing a flag like `tp local <template> --full`, I personally like this option because almost all the templates will be just for that project, you won't share it with more projects.

Then, after saving locally, commit that change and push, on another machine, you can clone those changes and run `tp restore` to install those templates on that machine.

# Installing Templates

You can install templates from anywhere, you just need a link to a valid `yaml` file with the correct syntax ([see here](#creating-templates)).

To test it out, you can run the `install` command with a file hosted inside Github Gist:

```bash
tp install from-internet https://gist.githubusercontent.com/H4ad/bc6e6f2af449942b8cd1b8220aa4adb9/raw/82afb3493454f18f5aa2a0abd408307c4a7b4c6c/tp.yml
```

The first argument will be the template name and the second is the template URL.

For this first release I only support installing from simple URLs, but I have plans to support repositories as well.

# Generating Resources

Each template will export some resources, you can use the name of that resource so you can create some boilerplate code.

To know what resources you can create, based on the installed templates you have, you can run:

```bash
tp ls
```

If you want to know which resources for a specific model, you can use pass the name like:

```bash
tp ls my-model
```

Or, if you want to limit the visualization to just listing the resources you can generate locally, you can run:

```bash
tp ls -l
```

Knowing which feature you want to create, first, make sure the template is installed locally using:

```bash
tp local my-template
```

`tp` only looks for templates that are installed locally when generating new resources, this ensures that your colleague doesn't create things inside the project and doesn't share it with other people.

So, you can just run:

```bash
tp generate <resource> <name>
```

Every resource needs to pass a name, even if the resource doesn't actually use it (which I think is unlikely but could happen).

# Removing Templates

If you don't use anymore some template, you can remove it with:

```bash
tp rm my-template
```

> Take care when running this command, this is an IRREVERSIBLE action.

# Reference

<!-- commands -->
* [`tp autocomplete [SHELL]`](#tp-autocomplete-shell)
* [`tp g RESOURCE NAME`](#tp-g-resource-name)
* [`tp generate RESOURCE NAME`](#tp-generate-resource-name)
* [`tp help [COMMANDS]`](#tp-help-commands)
* [`tp install NAME URL`](#tp-install-name-url)
* [`tp l NAME`](#tp-l-name)
* [`tp list [NAME]`](#tp-list-name)
* [`tp local NAME`](#tp-local-name)
* [`tp ls [NAME]`](#tp-ls-name)
* [`tp open [NAME]`](#tp-open-name)
* [`tp remove [NAME]`](#tp-remove-name)
* [`tp restore [NAME]`](#tp-restore-name)
* [`tp rm [NAME]`](#tp-rm-name)
* [`tp start NAME`](#tp-start-name)

## `tp autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ tp autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ tp autocomplete

  $ tp autocomplete bash

  $ tp autocomplete zsh

  $ tp autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v2.1.3/src/commands/autocomplete/index.ts)_

## `tp g RESOURCE NAME`

Generate some resource from templates.

```
USAGE
  $ tp g RESOURCE NAME [--json] [--force] [--template <value>] [--path <value>]

ARGUMENTS
  RESOURCE  Specify the resource that will be generated.
  NAME      Specify the name of this new resource.

FLAGS
  --force             If the files already generated, override the content.
  --path=<value>      Specify the base path that will be used during creation.
  --template=<value>  Specify the template we will look for to generate the feature.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Generate some resource from templates.

ALIASES
  $ tp g

EXAMPLES
  $ tp generate <resource> <name>

  $ tp g <resource> <name>

  $ tp g <resource> <name> --template <my-template>
```

## `tp generate RESOURCE NAME`

Generate some resource from templates.

```
USAGE
  $ tp generate RESOURCE NAME [--json] [--force] [--template <value>] [--path <value>]

ARGUMENTS
  RESOURCE  Specify the resource that will be generated.
  NAME      Specify the name of this new resource.

FLAGS
  --force             If the files already generated, override the content.
  --path=<value>      Specify the base path that will be used during creation.
  --template=<value>  Specify the template we will look for to generate the feature.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Generate some resource from templates.

ALIASES
  $ tp g

EXAMPLES
  $ tp generate <resource> <name>

  $ tp g <resource> <name>

  $ tp g <resource> <name> --template <my-template>
```

_See code: [dist/commands/generate/index.ts](https://github.com/H4ad/tp-cli/blob/v1.0.1/dist/commands/generate/index.ts)_

## `tp help [COMMANDS]`

Display help for tp.

```
USAGE
  $ tp help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for tp.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.6/src/commands/help.ts)_

## `tp install NAME URL`

Install a tp template from an URL.

```
USAGE
  $ tp install NAME URL [--json] [--force]

ARGUMENTS
  NAME  Specify the template name that will be installed.
  URL   Specify the URL where the template are hosted.

FLAGS
  --force  If the template already installed, override the current installation.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Install a tp template from an URL.

EXAMPLES
  $ tp install <name> <url>
```

_See code: [dist/commands/install/index.ts](https://github.com/H4ad/tp-cli/blob/v1.0.1/dist/commands/install/index.ts)_

## `tp l NAME`

Save the template reference inside ".tp.yml" so you can restore it later to use the same template on other machines.

```
USAGE
  $ tp l NAME [--json] [--full]

ARGUMENTS
  NAME  Specify the template name that will be saved locally.

FLAGS
  --full  Instead use "installUrl", save the entire template locally.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Save the template reference inside ".tp.yml" so you can restore it later to use the same template on other machines.

ALIASES
  $ tp l

EXAMPLES
  $ tp l test

  $ tp local test
```

## `tp list [NAME]`

List installed templates

```
USAGE
  $ tp list [NAME] [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [--locally]

ARGUMENTS
  NAME  Specify the model name to list what this template can generate.

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --locally          Just list the templates that are installed locally.
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed templates

ALIASES
  $ tp ls

EXAMPLES
  $ tp ls

  $ tp list

  $ tp ls my-api

  $ tp list my-api
```

_See code: [dist/commands/list/index.ts](https://github.com/H4ad/tp-cli/blob/v1.0.1/dist/commands/list/index.ts)_

## `tp local NAME`

Save the template reference inside ".tp.yml" so you can restore it later to use the same template on other machines.

```
USAGE
  $ tp local NAME [--json] [--full]

ARGUMENTS
  NAME  Specify the template name that will be saved locally.

FLAGS
  --full  Instead use "installUrl", save the entire template locally.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Save the template reference inside ".tp.yml" so you can restore it later to use the same template on other machines.

ALIASES
  $ tp l

EXAMPLES
  $ tp l test

  $ tp local test
```

_See code: [dist/commands/local/index.ts](https://github.com/H4ad/tp-cli/blob/v1.0.1/dist/commands/local/index.ts)_

## `tp ls [NAME]`

List installed templates

```
USAGE
  $ tp ls [NAME] [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [--locally]

ARGUMENTS
  NAME  Specify the model name to list what this template can generate.

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --locally          Just list the templates that are installed locally.
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed templates

ALIASES
  $ tp ls

EXAMPLES
  $ tp ls

  $ tp list

  $ tp ls my-api

  $ tp list my-api
```

## `tp open [NAME]`

Open the folder where templates are saved.

```
USAGE
  $ tp open [NAME] [--json]

ARGUMENTS
  NAME  Specify the template name that will be opened.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Open the folder where templates are saved.

EXAMPLES
  $ tp open test
```

_See code: [dist/commands/open/index.ts](https://github.com/H4ad/tp-cli/blob/v1.0.1/dist/commands/open/index.ts)_

## `tp remove [NAME]`

Remove an installed template.

```
USAGE
  $ tp remove [NAME] [--json]

ARGUMENTS
  NAME  Specify the template name that will be removed.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Remove an installed template.

ALIASES
  $ tp rm

EXAMPLES
  $ tp remove <name>
```

_See code: [dist/commands/remove/index.ts](https://github.com/H4ad/tp-cli/blob/v1.0.1/dist/commands/remove/index.ts)_

## `tp restore [NAME]`

Restore saved templates from ".tp.yml"

```
USAGE
  $ tp restore [NAME] [--json] [--force]

ARGUMENTS
  NAME  Specify the template name that will be restored.

FLAGS
  --force  If the template already installed, override the current installation.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Restore saved templates from ".tp.yml"

EXAMPLES
  $ tp restore
```

_See code: [dist/commands/restore/index.ts](https://github.com/H4ad/tp-cli/blob/v1.0.1/dist/commands/restore/index.ts)_

## `tp rm [NAME]`

Remove an installed template.

```
USAGE
  $ tp rm [NAME] [--json]

ARGUMENTS
  NAME  Specify the template name that will be removed.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Remove an installed template.

ALIASES
  $ tp rm

EXAMPLES
  $ tp remove <name>
```

## `tp start NAME`

Start a new template.

```
USAGE
  $ tp start NAME [--json] [--force]

ARGUMENTS
  NAME  Name of the template

FLAGS
  --force  If the template already exist, it removes and start a new one.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Start a new template.

EXAMPLES
  $ tp start my-api
```

_See code: [dist/commands/start/index.ts](https://github.com/H4ad/tp-cli/blob/v1.0.1/dist/commands/start/index.ts)_
<!-- commandsstop -->

[build-img]:https://github.com/H4ad/tp-cli/actions/workflows/release.yml/badge.svg

[build-url]:https://github.com/H4ad/tp-cli/actions/workflows/release.yml

[downloads-img]:https://img.shields.io/npm/dt/@h4ad/tp-cli

[downloads-url]:https://www.npmtrends.com/@h4ad/tp-cli

[npm-img]:https://img.shields.io/npm/v/@h4ad/tp-cli

[npm-url]:https://www.npmjs.com/package/@h4ad/tp-cli

[issues-img]:https://img.shields.io/github/issues/H4ad/tp-cli

[issues-url]:https://github.com/H4ad/tp-cli/issues

[codecov-img]:https://codecov.io/gh/H4ad/tp-cli/branch/master/graph/badge.svg

[codecov-url]:https://codecov.io/gh/H4ad/tp-cli

[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[semantic-release-url]:https://github.com/semantic-release/semantic-release

[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[commitizen-url]:http://commitizen.github.io/cz-cli/
