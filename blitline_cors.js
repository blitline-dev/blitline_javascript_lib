// Version 1.20, Blitline LLC, License WTFPL, http://en.wikipedia.org/wiki/WTFPL

Blitline = function() {
	var submittedCallback,
		completedCallback,
		inProgress = false,
		images = [],
		serverUrl = (window.location.protocol + "//api.blitline.com"),
		cacheUrl = (window.location.protocol + "//cache.blitline.com/listen/");

	this.submit = function(jobs, callbacks) {
		var validationErrors = [],
			normalizedJobs;

		if (!jobs) { validationErrors.push("No haz jobs...");}
		if (inProgress) { validationErrors.push("You cannot resubmit a job when one is already in progress, make a seperate Blitline object if you want to do multiple calls.");}

		try {
			normalizedJobs = normalizeJobsIntoArray(jobs);
		}catch(ex) {
			validationErrors.push("Failed to parse jobs data: " + ex.message);
		}

		if (validationErrors.length > 0) {
			var returnableErrors = validationErrors.join(", ");
			if(completedCallback) {
				completedCallback(images, returnableErrors);
			}
			return returnableErrors;
		}

		if (callbacks) {
			submittedCallback = callbacks.submitted;
			completedCallback = callbacks.completed;
		}
		images = [];
		var errors = validateJobs(normalizedJobs);

		if (!errors) {
			inProgress = true;
			postCORS(serverUrl + "/job", { json : JSON.stringify(normalizedJobs) }, function(response) {
				try {
					if (typeof response === "string") {
						response = JSON.parse(response);
					}

					var results = response.results,
						returnedErrors = [];

					// Result returned, look for errors
					_.each(results, function(result) {
						if (result.error) {
							returnedErrors.push(result.error);
						}
					});
					if (returnedErrors.length > 0) {
						handleCompletedCallback(null, returnedErrors.join(", "));
					}else {
						handleSubmittedCallback(results);
					}
				}catch(ex) {
					inProgress = false;
					errors = "Unable to submit to Blitline:" + ex.message;
				}
			});
		}else {
			handleCompletedCallback(null, errors);
		}
		return errors;
	};

	function normalizeJobsIntoArray(jobs) {
		// Force jobs into array if it's passed as a string
		if (_.isArray(jobs)) {
			return jobs;
		}
		if (JSON) {
			var json = JSON.parse(jobs);
			if (_.isArray(json)) {
				return json;
			}
			return [json];
		}else {
			throw "jobs must be passed as an array on browsers that don't support JSON.parse...I'm talking to YOU ie<8";
		}
	}

	function handleCompletedCallback(images, error) {
		inProgress = false;
		if(completedCallback) {
			completedCallback(images, error);
		}
	}

	function handleSubmittedCallback(results) {
		var jobIds = [],
			image_results = results;
		_.each(image_results, function(image_sets) {
			jobIds.push(image_sets.job_id);
			_.each(image_sets.images, function(image) {
				images.push(image);
			});
		});
		if (submittedCallback) {
			try {
				submittedCallback(jobIds, images);
			}catch(ex) {
			}
		}
		pollForCompletion(jobIds);
	}

	function pollForCompletion(jobIds) {
		// Switched to using Blitline long polling
		var images = [];
		_.each(jobIds, function(job_id) {
			var destUrl = cacheUrl + job_id.toString();

			$.ajax({
				url: destUrl,
				dataType: "jsonp",
				success: function(data) {
					if (data && data[0].results) {
						if (data[0].results) {
							var jsonResult;
							if ((typeof data[0].results)=="string") {
								jsonResult = JSON.parse(data[0].results);					
							}else {
								jsonResult = data[0].results;
							}
							images.push(jsonResult);
						}
						if (images.length == jobIds.length) {
							handleCompletedCallback(images, data[0].results.has_errors ? "Server side error. Check dasboard." : null);
						}
					}
				}
			});
		});
	}

	function validateJobs(jobs) {
		var errors = [];
		_.each(jobs , function(job) {
			if ((!job.application_id && !job.signature) || !job.src) { errors.push("You must have both an application_id and src for each job.");}
			if (!job.functions || job.functions.length === 0) { errors.push("You dont have any functions defined for this job."); }
			_.each(job.functions , function(blitlineFunction) {
				if (!blitlineFunction.name) { errors.push("You are missing a function name"); }
				if (blitlineFunction.save) {
					if (!blitlineFunction.save.image_identifier) { errors.push("You must have an image_identifier for every save function");}
					var s3_destination = blitlineFunction.save.s3_destination;
					if (s3_destination) {
						if (!s3_destination.bucket || !s3_destination.key) { errors.push("You must have a bucket and key for every s3_destination");}
					}
				}
			});
		});
		return errors.length > 0 ? errors.join(", ") : null;
	}

	/**
	* This method is for Cross-site Origin Resource Sharing (CORS) POSTs
	*
	* @param string   url      the url to post to
	* @param mixed    data     additional data to send [optional]
	* @param function callback a function to call on success [optional]
	* @param string   type     the type of data to be returned [optional]
	*/
	function postCORS(url, data, callback, type)
	{
		var fallback = function(){
			// jQuery POST failed
			var params = '';
			var key;
			for (key in data) {
				params = params+'&'+key+'='+encodeURIComponent(data[key]);
			}
			// Try XDR, or use the proxy
			if (jQuery.browser.msie && window.XDomainRequest) {
				// Use XDR
				var xdr = new XDomainRequest();
				xdr.open("post", url);
				xdr.onprogress = function() {};
				xdr.onload = function() {
					callback(handleXDROnload(this, type), 'success', this);
				};
				xdr.send(params);
			} else {
				try {
					// Use the proxy to post the data.
					request = new proxy_xmlhttp();
					request.open('POST', url, true);
					request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					request.send(params);
				} catch(e) {
					// could not post using the proxy
				}
			}
		}
		try {
			// Try using jQuery to POST
			jQuery.post(url, data, callback, type).fail(fallback);
		} catch(e) {
			fallback();
		}
	}

	/**
	* Because the XDomainRequest object in IE does not handle response XML,
	* this function acts as an intermediary and will attempt to parse the XML and
	* return a DOM document.
	*
	* @param XDomainRequest xdr  The XDomainRequest object
	* @param string         type The type of data to return
	*
	* @return mixed
	*/
	function handleXDROnload(xdr, type)
	{
		var responseText = xdr.responseText, dataType = type || "";
		if (dataType.toLowerCase() == "xml" && typeof responseText == "string") {
			// If expected data type is xml, we need to convert it from a
			// string to an XML DOM object
			var doc;
			try {
				if (window.ActiveXObject) {
					doc = new ActiveXObject('Microsoft.XMLDOM');
					doc.async = 'false';
					doc.loadXML(responseText);
				} else {
					var parser = new DOMParser();
					doc = parser.parseFromString(responseText, 'text/xml');
				}
				return doc;
			} catch(e) {
				// ERROR parsing XML for conversion, just return the responseText
			}
		}
		return responseText;
	}
};



