##### Using Blitline Javascript

The blitline.js file allows a simpler way to commit jobs to Blitline via javascript. Although Blitline was designed to be used by backends
to handle image processing, many people have been expressed interest in scripting blitline jobs via javascript.

#### What's the point of it?

Specifically, if you have a big bucket of images you want processed, you can write javascript to process them instead of implementing a ruby
or nodejs or whatever language app. Imagine you are writing a script for someone else, and you don't know if they are Mac/PC or if they even know
how to install ruby/node/whatever. You can write it in javascript and be sure that they will be able to execute it.

#### Should I use this on my site instead of the Blitline gems or NPM?

NO! Nein! Sorry... I didn't mean to get so excited, but no. Ideally this is for small scripting projects, not enterprise solutions. You are MUCH
better off using Blitline on the server the way it was intended. The .js uses polling, which sucks, for everyone involved, so lets try to keep it
minimized. Also, the blitline.js doesn't provide very robust error handling or meta-information, and you dont get all the information you may want back,
that you would get via the standard Blitline postback.

#### Why is stuff called CORS?

Behind the scenes, the cross domain posting happens via CORS
* http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing
* http://www.tsheffler.com/blog/?p=428
* http://www.w3.org/TR/cors/

Blitline supports CORS headers for cross domain ajax/posts and ajax/gets, which makes it easy for browsers to submit jobs to Blitline.

#### Browser Support?

* Safari : YES
* Chrome : YES
* Firefox: YES
* IE8+   : YES
* IE7-   : NO (Sorry IE7ers, you are on your own)

#### Is there any way other than CORS?
Yes. If you want to use something that uses IFRAMEs messaging, like http://benalman.com/code/projects/jquery-postmessage/docs/files/jquery-ba-postmessage-js.html,
we have some support for this. Write us at support@blitline.om and we can give you some help guidance.

#### How do I use it?
There is only two files, just download them and look at them. I think it's pretty self explanatory. You create a Blitline object, then submit jobs with some callback
events and the blitline_cors.js library will take care of everything else for you.

#### What are the requirements?
The blitline_cors.js javascript library relies on *JQuery*, and *Underscore.js*. You must have both of these on your page for the blitline javascript library to work.





