# Homework 3: Cache, Proxies, Queues

This assignment is based on the workshop https://github.com/CSC-DevOps/Queues

There are two files, main.js and proxy_server.js

The files main.js and proxy_server.js complete the following requirements:

1. Complete set/get for an expiring cache
    
    If the main.js is running on port 3000, then localhost:3000/set sets a key which expires after 10 sec. The /get routine displays this key on localhost:3000/get
2. Complete recent

    If we run main.js on port 3000, then localhost:3000/recent displays a list of 5 recently visited sites
3. Complete upload/meow
    
    The curl command is used to upload image from the command line. The method /upload saves this image in a queue. The method /meow pops it from the queue and displays on localhost:3000/meow if main.js is running on 3000.
4. Additional service instance
    
    Suppose the main.js is already running on port 3000, an additional instance can be run on another port, say 3001.
    Commands for running main.js on 3000 and an additional instance on 3001:

    ```
    node main.js 3000 (On 1 terminal)
    node main.js 3001 (On second terminal)
    ```
5. Demonstrate proxy
    
    The code proxy_server.js creates a proxy server that listens on port 8080 and uniformly delivers requests to the ports 3000 and 3001 (if main.js is running on them)
    Commands:

    ```
    node main.js 3000 (On 1 terminal)
    node main.js 3001 (On second terminal)
    node proxy_server.js (On third terminal)
    ```