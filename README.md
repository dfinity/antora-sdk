# UI for Dfinity Internet Computer Documentation

This project uses [Antora](https://antora.org) to generate an interface for the Dfinity Internet Computer documentation site. The [dfinity-docs-playbook](https://github.com/dfinity-lab/dfinity-docs-playbook) pulls in the `ui-bundle.zip` file from this repo and the documentation from the [dfinity-lab/docs](https://github.com/dfinity-lab/docs) repo in order to generate the static documentation site. 

## Development
Run `gulp preview` to run the project locally. Doing this uses samply documentation (not the actually docs defined in [dfinity-docs-playbook](https://github.com/dfinity-lab/dfinity-docs-playbook) ).

## Building the UI
Once you're happy with the changes, run `gulp-bundle` to generate a new `ui-bundle.zip` folder. The [dfinity-docs-playbook](https://github.com/dfinity-lab/dfinity-docs-playbook) repo references this zip file on the `master` branch.

## Deployments
Deployments are handled automatically through netlify whenever commits to master happen on [dfinity-docs-playbook](https://github.com/dfinity-lab/dfinity-docs-playbook). Since this repo doesn't trigger netlify deployments, you'll have to manually kick off a new deployment from Netlify.

#### Note
If you want to preview the site with actuall content before deploying, you can run `antora antora-playbook.yml` in [dfinity-docs-playbook](https://github.com/dfinity-lab/dfinity-docs-playbook) which will generate the site. 


## Further Antora Documentation
[Further Antora Documentation](https://gitlab.com/antora/antora-ui-default)
