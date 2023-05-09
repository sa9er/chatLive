import { Redis } from "@upstash/redis"

export const db = new Redis({
    url: 'https://eu2-actual-moose-31629.upstash.io',
    token: 'AXuNASQgMWI2NzdlM2MtMTBmMy00YWE3LTkzMDQtNjZjNDFjNWI0NGU0OWY4OWZjMThiZjkzNGM4NzkwYzFlNWRmNWU0MmYyODc=',


})