# MP4 Quiz Game Frontend
See also: [Backend of this project](https://github.com/Luythen/MP4-Backend)

## About the project
This is the frontend for a real-time multiplayer quiz game. This client uses WebSockets with STOMP and SockJS to continuously synchronize player positions, the timer, questions and scores.

This is a quiz game, where players are presented with a question and 4 options for an answer. There is only 1 correct answer. 
Players must first enter their name/alias. When 3 players have done so, the game will start. 
After the game starts, players must move their icon to the correct answer using the keyboard arrows. Score will be distributed as follows:
- The player who answer correctly first will receive 2 points.
- Players who answer correctly but not first will receive 1 point.
- Players who answer incorrectly will lose 1 point.
- Players who do not place their icon on any answer will lose 2 points.

This project was made for a school assignment. Its purpose is to practice implementations of WebSocket and estimating project time consumption/scope.

## How to run

To run the project, run 
```
git clone git@github.com:Luythen/MP4-Frontend.git
```
Create a .env file in the root. There is a .env.example file to show the variables you need to set.  
To start the client: 
from the root of the folder, run:
```
npm run dev
```

## Features

| Feature                        | Incomplete | Implemented |
| ------------------------------ | :--------: | :---------: |
| Players choose their names     |            |      x      |
| Gamestart when players join    |            |      x      |
| Synced timer                   |            |      x      |
| Synced questions               |            |      x      |
| Randomised questions           |            |      x      |
| Correct answer gives score     |            |      x      |
| Wrong answer withdraw score    |            |      x      |
| Scorekeeping on scoreboard     |            |      x      |
| Score visible after game end   |            |      x      |
| Edit/add questions with JSON   |            |      x      |
| Players can choose color       |     x      |             |
| Restart game with same players |     x      |             |


## Technologies used
* React
* STOMP
* SockJS
* WebSockets
* Vite

## Hosting
* DigitalOcean

## Known bugs
* Player names are quite unrestricted, can look visually strange.
