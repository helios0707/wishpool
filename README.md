# wishpool
All that is needed to deploy our app for production is the following:

1. Install node.js, npm and ArangoDB 
	1) Install node.js
		
		sudo apt-get update
		sudo apt-get install nodejs

	2) Install npm
		
		sudo apt-get install npm

	3) Install Arangodb
		
		wget https://www.arangodb.com/repositories/arangodb2/xUbuntu_14.04/Release.key
		sudo apt-key add Release.key
		sudo apt-add-repository 'deb https://www.arangodb.com/repositories/arangodb2/xUbuntu_14.04/ /'
		sudo apt-get update
		sudo apt-get install arangodb

2, Deploy the Foxx app
    you can simply point your browser to

	http://localhost:8529

	choose the "Applications" tab and click on the big Add Application button. Use the github tab and enter ArangoDB/wishpool under "Repository", leave master under "Version". After you click "Install" you are prompted for a mount point, choose /wishpool and click "Configure". After that, the "wishpool" app should appear under "Applications". You can test whether or not this worked by pointing your browser to

	http://localhost:8529/_db/_system/wishpool/groups

	which should give you the initial question as a JSON document.

	If you do not keep your Foxx app in a public github repository then you can also deploy it using a local zip file. Create a zip archive of the wishpool repository that contains the folder wishpool on the top level and upload it using the zip tab behind the Add Application button described above.
3. Install frontend and backend dependencies
	
	npm install
	bower install

4. Deploy the node.js application together with the static web content.