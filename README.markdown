# Important!
## Blitline Javascript Library has changed...

Specifically:

- If you are using an older version, the completed callback returns results, not an array of images. The results corresponds to exactly what would be returned by long polling or the Blitline postback.
- Long polling is used now for better performance
- Simpler example and better handling of images
- Added WTFPL (http://en.wikipedia.org/wiki/WTFPL) license to blitline_cors.js

---
#### Using Blitline Javascript

Just include blitline_cors.js in your html!

The blitline_cors.js file allows a simpler way to commit jobs to Blitline via javascript. Although Blitline was designed to be used by backends
to handle image processing, many people have been expressed interest in scripting blitline jobs via javascript.

#### What's the point of it?

Specifically, if you have a big bucket of images you want processed, you can write javascript to process them instead of implementing a ruby
or nodejs or whatever language app. Imagine you are writing a script for someone else, and you don't know if they are Mac/PC or if they even know
how to install ruby/node/whatever. You can write it in javascript and be sure that they will be able to execute it.

<b> Warning/Reminder! </b>Obviously too, you don't want to give clients your Blitline Application ID, because thats YOUR secret. If you give it to clients
they could process stuff under your account. Blitline supports signed expiring tokens so you can give the clients tokens which
expire which allows them to process an item under your App ID, without giving them your App ID (see http://blog.blitline.com/day/2011/12/27 for
more details).

#### Why is stuff called CORS?

Behind the scenes, the cross domain posting happens via CORS

* http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing
* http://www.tsheffler.com/blog/?p=428
* http://www.w3.org/TR/cors/

Blitline supports CORS headers for cross domain ajax/posts and ajax/gets, which makes it easy for browsers to submit jobs to Blitline.


#### Browser Support? Which browsers will it just "work" on?

* Safari : YES
* Chrome : YES
* Firefox: YES
* IE8+	 : YES

#### How do I use it?
There is only two files, just download them and look at them. I think it's pretty self explanatory. You create a Blitline object, then submit jobs with some callback
events and the blitline_cors.js library will take care of everything else for you.

##Simple Example:
		// Set your own App ID;
	var myAppId = "YOUR_APP_ID"

		// Create Blitline Object
	var blitline = new Blitline();

	// Add events for handling submitted and completed
	var events = {
		completed : function(results, error) {
			alert("Job completed:" + JSON.stringify(results));
		},
		failedSubmission: function(error) {
			alert("Error: " + error);
		}

	}

	// Build your JSON
	var json = { "application_id": myAppId, "src" : "http://www.google.com/logos/2011/yokoyama11-hp.jpg", "functions" : [ {"name": "blur", "params" : {"radius" : 0.0,	"sigma" : 2.0}, "save" : { "image_identifier" : "MY_CLIENT_ID" }} ]};

		// Submit it
	blitline.submit(JSON.stringify(json), events);

Otherwise, check out cors.html for a more complete example.

#### What are the requirements?
The blitline_cors.js javascript library relies on *JQuery*, and *Underscore.js*. You must have both of these on your page for the blitline javascript library to work.

#### Licensing?

The project is licensed under the http://en.wikipedia.org/wiki/WTFPL license.
