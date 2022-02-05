# Websocket-Room

Bare minimum room messaging system using websockets.

## Introduction

This project was created to learn about websockets. Fastify was chosen with no particular reason.

You can create a passworded room, and communicate to other clients via a basic messaging system.

Each connection is assigned a `client` ID.

The websocket can be accessed at `localhost:8080/ws`. A very simple react front-end page has been created in order to play aroundMultiple connections can be made by opening additional tabs.

See `./src/actions` methods for the API requirments.

The postman folder contains some examples of queries you can send.

## Motivation

The original motivation was to implement something similar to Google's Firebase real-time database system, where using websockets users can set a `json` style database, and send updates when changes occur. I have since removed the database aspect as there are numerous database style to choose from.
