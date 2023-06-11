const fs = require('fs')

const csvPath = './resource/player_list.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8')
const csvLines = csvContent.split('\n')
const csvHeader = csvLines.shift()

const players = []
const properties = csvHeader.split(',')
for (csvLine of csvLines) {
  const player = {}
  const values = csvLine.split(',')
  for (let i = 0; i < properties.length; i++) {
    player[properties[i]] = values[i]
  }
  players.push(player)
}
console.log(players)
