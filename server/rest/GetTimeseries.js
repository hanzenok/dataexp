var tsproc = require('tsproc');

//connectors
var mongo_connector = require('../connectors/MongoConnector');
var mysql_connector = require('../connectors/MysqlConnector');
var file_connector = require('../connectors/FileConnector');
var ConnectorsEnum = {
	
					'mongo': mongo_connector,
					'mysql': mysql_connector,
					'json': file_connector,
					'csv': file_connector
					};

/**
 * Rest API's offered by server.
 * @module server
 * @submodule RestApi
 */

//stats config
var stats = {};
stats.homogen = '?';
stats.size = '?';
stats.per_day = '?';
stats.from = '';
stats.to = '';

//ts config
var config = {};

/**
 * @class GetTimseries
 */
var TS = {};

/**
 * A method that returns (via the object <code>res</code>) the full
 * timeseries with all requested (via the object <code>req</code>) fields.
 * The <code>tsproc</code> configuration is also passed by <code>req</code> object.
 * <br/>
 * The method passes all the timeseries through the <code>tsproc</code> module.
 * @method getTimeseries
 * @param {request} req Express.js request
 * @param {response} res Express.js response
 * 
 */
TS.getTimeseries = function(req, res){

	//get the requested dataset
	var fields_config = req.body;

	//fields_config is an array of size 3
	//0 - config file
	//1 - timestamp fields
	//2 - other fields
	if(fields_config.length){

		//regroup the fields from the same source
		var new_fields_config = regroupFields.call(this, fields_config);

		//options config
		var options = fields_config[0];

		if(!new_fields_config){

			res.status(500).send('Some field(s) are missing the timestamp');
			return;
		}

		//load all the data
		//from the specified sources
		var n = new_fields_config.length;
		var promises = new Array(n);
		for (var i=0; i<n; i++){

			promises[i] = new Promise(function(resolve, reject){

				ConnectorsEnum[new_fields_config[i].source.type].getDataset(new_fields_config[i], function(error, dataset){

					if (dataset) resolve(dataset);
					if (error) reject(error);
				});
			});
		}

		//process the data
		Promise.all(promises)
		.then(function(datasets){

			//callback
			var callback = function(err, data){

				if (err) res.status(500).send(err.message);
				if (data) res.json(data);
			}

			//parse a config for tsproc
			//options
			var tsproc_config = {};
			var tmp;
			tsproc_config.transform = options.transform;
			tsproc_config.reduction = options.reduction;
			tsproc_config.date_borders = options.date_borders;
			tsproc_config.correlation = options.correlation;

			// //fields
			tsproc_config.timeseries = [];
			new_fields_config.forEach(function(config, index, array){

				tmp = {};
				tmp.fields = [];
				config.fields.forEach(function(field, ind){

					if (field.format){

						tmp.timestamp = field;
					}
					else{

						tmp.fields.push(field);
					}

				});

				tsproc_config.timeseries.push(tmp);
			});

			//save the config before using tsproc
			//cause tsproc will modify it (if timeseries is
			//not homogeneous)
			config = JSON.parse(JSON.stringify(tsproc_config));

			//instantiate the timeseries processor
			var tsp = new tsproc(datasets, tsproc_config, callback);
			
			//generate a stats json
			//check the homgenity before the processing
			//(after the processing timeseries becomes homogeneous)
			//precutting to assure that the homogen value is accurate
			tsp.cut([tsproc_config.date_borders.from.date, tsproc_config.date_borders.to.date]);
			stats.homogen = tsp.isHomogeneous(); //check the 

			//process the timseries
			tsp.process(function(err, data){

				if (err) res.status(500).send(err.message);
			});

			//check the correlations
			//if size > 3000 means that 
			//Canvas.js is used on the front-end;
			//it means that a graph chart doesn't have
			//a scroll chart to visualise the correlations
			if (tsp.getTSSize() <= 3000){

				tsp.checkSimilarity(callback);
			}
			else{

				//return a timeseries
				tsp.getTS(callback);
			}

			//get the other stats
			var borders = tsp.getBorders();
			stats.from = borders[0];
			stats.to = borders[1];
			stats.size = tsp.getTSSize();
			stats.per_day = tsp.getAvgPerDay();
		})
		.catch(function(error){

			res.status(500).send(error.message);	
		});
	}
}

/**
 * A method that returns (via the object <code>res</code>) the stats
 * that were pulled from <code>tsproc</code> module during the call of the <b>getTimeseries()</b> method.
 * @method getStats
 * @param {request} req Express.js request
 * @param {response} res Express.js response
 */
TS.getStats = function(req, res){
	
	res.json([stats]);
}

/**
 * A method that returns (via the object <code>res</code>) the configuration file
 * that was pulled from <code>tsproc</code> module during the call of the <b>getTimeseries()</b> method.
 * <br/>
 * The config is pulled from <code>tsproc</code> before it starts to process data, which can modify the config.
 * @method getConfig
 * @param {request} req Express.js request
 * @param {response} res Express.js response
 */
TS.getConfig = function(req, res){

	res.json([config]);
}

/**
 * A method that receives an array of size 3 (from front-end) that contains:
 * - 0: <code>tsproc</code> module options
 * - 1: array of timestamp fields configuration
 * - 2: array of other fields configuration
 *
 * Then it pulls from it the two arays, and returns
 * a single configuration which has all the fields
 * regrouped by store (cf example)
 * <br/>
 * The method is used to prepare a configuration file for the <code>tsproc</code>.
 * @method regroupFields
 * @param {json array} configs An array of configurations for tsproc module
 * 
 * @example
 *     //config in
 *     var old_config = 
 *     [
 *          //tspoc config
 *          {
 *            "transform": {
 *                 "type": "interp",
 *                 "interp_type": "linear"
 *             },
 *             "reduction": {
 *                 "type": "skip",
 *                 "size": 1,
 *                 "target_field": ""
 *             },
 *             "date_borders": {
 *                 "from": {
 *                    "date": ""
 *                 },
 *                 "to": {
 *                     "date": ""
 *                 }
 *             },
 *             "correlation": null,
 *             "tsfield_quantum": "none"
 *         },
 *
 *         //timestamp fields
 *         [
 *             {
 *                 "field": {
 *                     "name": "year",
 *                     "value": 1911,
 *                     "format": "YYYY",
 *                     "quantum": "none"
 *                 },
 *                 "store": {
 *                     "name": "colorado_river",
 *                     "size": 61,
 *                 },
 *                 "source": {
 *                     "name": "rivers",
 *                     "type": "mongo",
 *                     "user": "",
 *                     "passw": "",
 *                     "server": "localhost",
 *                     "port": null,
 *                     "db": "river_flows"
 *                 }
 *             },
 *             {
 *                 "field": {
 *                     "name": "year",
 *                     "value": 1919,
 *                     "format": "YYYY",
 *                     "quantum": "none"
 *                 },
 *                 "store": {
 *                     "name": "funder_river",
 *                     "size": 37,
 *                 },
 *                 "source": {
 *                     "name": "rivers",
 *                     "type": "mongo",
 *                     "user": "",
 *                     "passw": "",
 *                     "server": "localhost",
 *                     "port": null,
 *                     "db": "river_flows"
 *                 }
 *             }
 *         ],
 *
 *         //other fields
 *         [
 *            {
 *                 "field": {
 *                     "name": "flows_colorado",
 *                     "value": 18.11,
 *                     "quantum": 0
 *                 },
 *                 "store": {
 *                     "name": "colorado_river",
 *                     "size": 61,
 *                 },
 *                 "source": {
 *                     "name": "rivers",
 *                     "type": "mongo",
 *                     "user": "",
 *                     "passw": "",
 *                     "server": "localhost",
 *                     "port": null,
 *                     "db": "river_flows"
 *                 }
 *             },
 *             {
 *                 "field": {
 *                     "name": "flows_funder",
 *                     "value": 26.42,
 *                     "quantum": 0
 *                 },
 *                 "store": {
 *                     "name": "funder_river",
 *                     "size": 37,
 *                 },
 *                 "source": {
 *                     "name": "rivers",
 *                     "type": "mongo",
 *                     "user": "",
 *                     "passw": "",
 *                     "server": "localhost",
 *                     "port": null,
 *                     "db": "river_flows"
 *                 }
 *             }
 *         ]
 *     ];
 *
 *     //config out
 *     var new_config = regroupFields.call(this, old_config);
 *     console.log(JSON.stringify(new_config, null, 4));
 *     //the result is:
 *     // [
 *     //    {
 *     //        "fields": [
 *     //            {
 *     //                "name": "year",
 *     //                "value": 1911,
 *     //                "format": "YYYY",
 *     //                "quantum": "none"
 *     //            },
 *     //            {
 *     //                "name": "flows_colorado",
 *     //                "value": 18.11,
 *     //                "quantum": 0
 *     //            }
 *     //        ],
 *     //        "store": {
 *     //            "name": "colorado_river",
 *     //            "size": 61
 *     //        },
 *     //        "source": {
 *     //            "name": "rivers",
 *     //            "type": "mongo",
 *     //            "user": "",
 *     //            "passw": "",
 *     //            "server": "localhost",
 *     //            "port": null,
 *     //            "db": "river_flows"
 *     //        }
 *     //    },
 *     //    {
 *     //        "fields": [
 *     //            {
 *     //                "name": "year",
 *     //                "value": 1919,
 *     //                "format": "YYYY",
 *     //                "quantum": "none"
 *     //            },
 *     //            {
 *     //                "name": "flows_funder",
 *     //                "value": 26.42,
 *     //                "status": "loaded",
 *     //                "quantum": 0
 *     //            }
 *     //        ],
 *     //        "store": {
 *     //            "name": "funder_river",
 *     //            "size": 37
 *     //        },
 *     //        "source": {
 *     //            "name": "rivers",
 *     //            "type": "mongo",
 *     //            "user": "",
 *     //            "passw": "",
 *     //            "server": "localhost",
 *     //            "port": null,
 *     //            "db": "river_flows"
 *     //        }
 *     //    }
 *     //]
 *     //all the fields are regrouped by store
 */
function regroupFields(configs){

	var timestamps = configs[1];
	var fields = configs[2];
	var n = timestamps.length;	
	var m = fields.length;

	var new_configs = new Array(n);
	var tmp;

	//prepare the timestamp fields
	timestamps.forEach(function(timestamp_config, index){

		tmp = {};
		tmp.fields = [];

		//copy the timestamp
		tmp.fields.push(timestamp_config.field);

		//and other info
		tmp.store = timestamp_config.store;
		tmp.source = timestamp_config.source;

		//add to the new config
		new_configs[index] = tmp;
	});


	//regroup the other fields
	var count_fields = 0;
	for (var i=0; i<n; i++){

		for (var j=0; j<m; j++){

			if (new_configs[i].source.name === fields[j].source.name &&
				new_configs[i].store.name === fields[j].store.name){

				new_configs[i].fields.push(fields[j].field);
				count_fields++;
			}
		}
	}

	//check if all timestamps have their
	//field associated
	for (var i=0; i<n; i++){

		if (new_configs[i].fields.length <= 1)
			return null;
	}

	//check if all fields were assciated
	//with a timestamp field:
	if (count_fields != m){

		return null;
	}

	return new_configs;
}

module.exports = TS;