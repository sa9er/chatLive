const upstashRedisUrl = 'https://eu2-actual-moose-31629.upstash.io'
const authToken = 'AXuNASQgMWI2NzdlM2MtMTBmMy00YWE3LTkzMDQtNjZjNDFjNWI0NGU0OWY4OWZjMThiZjkzNGM4NzkwYzFlNWRmNWU0MmYyODc='

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
    command: Command,
    ...args: (string | number)[]
) {
    const commandUrl = `${upstashRedisUrl}/${command}/${args.join('/')}`

    const response = await fetch(commandUrl, {
        headers: {
            Authorization: `Bearer ${authToken}`
        },
        cache: 'no-store'
    })

    if (!response.ok)
    {
        throw new Error(`Error redis command ${response.statusText}`)
    }

    const data = await response.json()
    return data.result
}