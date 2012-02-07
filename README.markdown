
<h4>
Using Blitline Javascript
</h4>

<p>
The blitline.js file allows a simpler way to commit jobs to Blitline via javascript. Although Blitline was designed to be used by backends to handle image processing, many people have been expressed interest in scripting blitline jobs via javascript.
</p>

<h4>
What's the point of it?
</h4>

<p>
Specifically, if you have a big bucket of images you want processed, you can write javascript to process them instead of implementing a ruby or nodejs or whatever language app. Imagine you are writing a script for someone else, and you don't know if they are Mac/PC or if they even know how to install ruby/node/whatever. You can write it in javascript and be sure that they will be able to execute it.
</p>

<h4>
Should I use this on my site instead of the Blitline gems or NPM?
</h4>

<p>
NO! Nein! Sorry... I didn't mean to get so excited, but no. Ideally this is for small scripting projects, not enterprise solutions. You are MUCH better off using Blitline on the server the way it was intended. The .js uses polling, which sucks, for everyone involved, so lets try to keep it minimized. Also, the blitline.js doesn't provide very robust error handling or meta-information, and you dont get all the information you may want back, that you would get via the standard Blitline postback.
</p>
