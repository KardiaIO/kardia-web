# Devops / Deploy Notes
***

## Dokku
[A quick how-to.](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-dokku-application)

[To give yourself access to deploy](http://blog.yld.io/2014/03/26/node-js-deployments-with-docker-dokku-digital-ocean/)

To see what's going on when your ssh'd in the server.
	
	docker ps -a  // Shows all active docker containers.
	
	dokku // Will show you all your available options.
	
	dokku logs <app-name> // App log.
	
Since Dokku is just a Docker container, we can use any Docker commands to do what we need.  Dokku [plugins](http://progrium.viewdocs.io/dokku/plugins) can make your life easier in place of those.

***

## Travis CI

Encrypted Envs cannot be created from a pull request.  This is a security measure Travis protects against.  The secure env vars in .travis.yml enclude all tokens except for POSTGRES_URL which is too long for the encryption sequence.  If you need the url for testing, break up the url by user, pass, uri and create three new secure encryptions with travis.  [node-travis-encrypt](https://github.com/pwmckenna/node-travis-encrypt)

***

## Python Server

We have the Python server sitting on the same Ubuntu server for now, but is easily transferable.  Mind the port number that we're connecting through.  At the moment we are hitting the Docker containers "inner" port to access our Node app.  [Supervisor](http://supervisord.org/) is running our server and keeping it up.


