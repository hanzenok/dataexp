{
    "transform": {
        "type": "interp",
        "interp_type": "linear"
    },
    "reduction": {
        "type": "skip",
        "size": 1,
        "target_field": ""
    },
    "date_borders": {
        "from": {
            "date": ""
        },
        "to": {
            "date": ""
        }
    },
   "correlation":{
      "count_negative": false,
     "max_coef": true
    },
    "timeseries": [
        {
            "fields": [
                {
                    "name": "flows_colorado"
                }
            ],
            "timestamp": {
                "name": "year",
                "format": "YYYY"
            }
        },
        {
            "fields": [
                {
                    "name": "flows_funder"
                }
            ],
            "timestamp": {
                "name": "year",
                "format": "YYYY"
            }
        }
    ]
}