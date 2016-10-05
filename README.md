# hamud
HAMUD - A highly available multi-user dungeon written in Node.js

## What is HAMUD?
HAMUD is first and foremost a [MUD](https://en.wikipedia.org/wiki/MUD). The primary goal of HAMUD is to allow players to connect to the server and be able to provide rolling updates to the entire codebase without players noticing or having to re-connect. It should work using a standard telnet connection with no fancy client required.

## How do you make a MUD highly available with telnet?
There are two primary components which can allow for a highly available connection.

### Echo Server
Players will connect to an available "echo" server. The echo server will handle new connections and any low-level telnet communication that has to occur. The echo server will assign each connection with a unique identifier and store that in Redis (a key-value store). Using this method, Redis will keep track of which unique identifiers are on which echo servers. The echo servers will then register themselves with Zookeeper to allow for service discovery from the game servers.

### Game Server
There can be one or more game servers at any point in time. When a game server comes online, it discovers the currently running echo servers via Zookeeper and makes a connection to each of them. When a player issues a command, it will go through echo and then echo will forward it to an open connection to one of the game servers. The game servers are stateless, so new ones can come and go as you please, which allows for rolling updates. Any state the game servers need to preserve is stored in Redis (to allow the other game servers to use the same state). When a game server needs to reach a particular player or group of players, it will look in Redis to determine which echo server is handling the connection for a given player id. It will then send an event to that echo server to send some text back to the desired player (or players).

## Why go through all this trouble just for a MUD?
I'm doing this for fun. Using this type of set up, the MUD could potentially handle hundreds of thousands of simultaneous connections, however, that will never be the case for a MUD. I think a big win here is the ability to provide rolling updates without having to restart the monolith server.

## Local Development
The best way to run this locally is to use docker containers for the third-party services (Zookeeper, Redis, Mongo).

Redis:

    docker run --name hamud-redis -d -p 6379:6379 redis

Mongo:

    docker run --name hamud-mongo -d -p 27017:27017 mongo
