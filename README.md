# dataexp

dataexp (Data Exploration) is a graphical tool, based on the _tsproc_ module, for exploration and visualisation of the timeseries from different sources such as MongoDB and MySQL databases and also JSON and CSS files. It is using [Angular-Material](https://material.angularjs.org/latest/) for the interface, the server side runs on the Node.js server.

## Versions
The application is using a local Node.js module _tsproc_, in order to import it (instructions bellow) __npm__ (package manager for Node.js) should be at least version 2 (3.8.2 used).

In order to support the [promises](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise) (server side), Node.js should be at least version 4 (4.4.0 used).

## Usage
In order to launch the application, first of all, all the dependencies should be installed. In order to to that the correct path to the _tsproc_ module should be specified in the __package.json__:

```
"devDependencies": {
  "tsproc": "file:../../path_to_tsproc_dir/tsproc"
}
```

Then, the server and client dependencies can be installed by launching:

```
sudo npm install
sudo bower install
```
Finally, execute this command in the root directory of the project:

```
npm start
```

If no errors are shown, the application is accessible at the _localhost:8080_.

## Authors
Developped by [Ganza Mykhailo](mailto:hanzenok@gmail.com) with supervision of [François Naçabal](mailto:francois.nacabal@maya-technologies.com) at [Maya Technologies](http://www.maya-technologies.com/en/).
