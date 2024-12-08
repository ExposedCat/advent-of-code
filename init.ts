async function init(day: number | string) {
  const result = await fetch(`https://adventofcode.com/2024/day/${day}`)
  const html = await result.text()
  const available = !html.startsWith('Please')
  if (available) {
    const header = html.split(`--- Day ${day}: `)[1].split(' ---')[0]
    const id = header.toLowerCase().replaceAll(' ', '-')
    console.log(id)
  } else {
    console.error(`Day ${day} is not yet available!`)
  }
}
