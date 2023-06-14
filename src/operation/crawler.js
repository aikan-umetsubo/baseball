const axios = require('axios')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const axiosInstance = axios.create({
  baseURL: 'https://www.fighters.co.jp',
  timeout: 3_000,
})

const titleMap = {
  '登録名/本名': 'real_name',
  'ふりがな': 'furigana',
  '生年月日': 'birthday',
  '年齢': 'age',
  '身長': 'height',
  '体重': 'weight',
  '出身地': 'birthplace',
  '投打': 'bats_and_throws',
}

const wait = async (ms) => {
  return new Promise(r => setTimeout(r, ms));
}

const generateRandomNumber = () => {
  return Math.random() * 5_000
}

const main = async () => {

  // 選手一覧を取得
  const listResponse = await axiosInstance.get('/team/player/list')
  const listDom = new JSDOM(listResponse.data)

  const playerPagePaths = []
  listDom.window.document.querySelectorAll('.c-player-directory__link').forEach((playerElement) => {
    playerPagePaths.push(playerElement.attributes['href'].value)
  })

  // 各選手の情報を取得
  profiles = []
  for (let playerPagePath of playerPagePaths) {
    const playerPageResponse = await axiosInstance.get(playerPagePath)
    const playerDom = new JSDOM(playerPageResponse.data)

    const profile = {}

    profile.uniform_number = playerDom.window.document.querySelector('.c-player-detail-hero__number').innerHTML

    playerDom.window.document.querySelectorAll('.c-player-detail-profile__item').forEach((profileElement) => {
      const title = profileElement.querySelector('.c-player-detail-profile__title').innerHTML
      const meta = profileElement.querySelector('.c-player-detail-profile__meta').innerHTML
      
      profile[titleMap[title]] = meta.trim()
    })

    profiles.push(profile)

    await wait(5_000 + generateRandomNumber())
  }

  console.log(`export const players = ${JSON.stringify(profiles, null, '  ')}`)
}

main()
