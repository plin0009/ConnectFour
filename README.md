# Connect Four

My first stab at React Native: here's a simple app which lets you play Connect Four on your phone.

## Features

* Experience Connect Four in the colorway of your choice (three options)
* Choose between light mode and dark mode
* Assign each side to either human or bot
* Buttons to undo moves and clear the board

## Snapshots

<table>
  <tr>
    <td>First screen</td>
     <td>Toggle human/bot for each side</td>
     <td>Menu screen with a different theme</td>
  </tr>
  <tr>
    <td><img src="/img/menu-light-1.png" width=270></td>
    <td><img src="/img/menu-bot.png" width=270></td>
    <td><img src="/img/menu-light-3.png" width=270></td>
  </tr>
 </table>

<table>
  <tr>
    <td>Match between two humans</td>
     <td>Match versus a bot</td>
     <td>Bot vs bot?</td>
  </tr>
  <tr>
    <td><img src="/img/match-dark-1.png" width=270></td>
    <td><img src="/img/match-bot-2.png" width=270></td>
    <td><img src="/img/match-botvsbot-dark-3.png" width=270></td>
  </tr>
 </table>
 
## Todo list

* Make game endings friendlier!
  * Display wins (highlight the four-in-a-row)
  * Handle draws
  * End screen with button to start a new game
* Make the bot smarter & optimize
* Different levels of bot
* Option to bypass confirmation to undo moves and reset board
* Going back to the menu saves the current game (+ continue game button)
