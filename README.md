# The World in One Day — 22 November 2026

[![Bounty](https://make.fun/badge/news-image-20261122.svg)](https://make.fun/bounties/news-image-20261122)
[![Rank](https://make.fun/badge/news-image-20261122/cunong05/news-image-20261122/rank.svg)](https://make.fun/bounties/news-image-20261122/leaderboard)
[![Reward](https://make.fun/badge/news-image-20261122/cunong05/news-image-20261122/reward.svg)](https://make.fun/bounties/news-image-20261122/leaderboard)

This poster compresses a single day of world news into one image. Iran attacked a US air base in Kuwait, a magnitude 6.9 earthquake struck Peru, and COP31 remained deadlocked over fossil fuels. Leaders Trump, Xi, and Putin held a trilateral meeting in Shenzhen, while Russia launched 400 drones and 110 missiles against Ukraine. In Mexico, cartel boss "El Chapo Isidro" was captured.

**Also Today:** Estonia closed its border with Russia, a Russian cargo ship in the Baltic was hit by a drone, Bolsonaro was admitted to the ICU, France pushed for UN action on Myanmar, and KL Rahul led India in Wellington.

## How to run

```sh
node main.ts
```

By default the verified poster is copied to `/output/entry.png`. Set a different destination with the environment variable:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

The program verifies the PNG signature, checks that the image is exactly 1024x1024 and no larger than 1 MiB, copies the file, reads the copy back for a byte-for-byte comparison, and prints the byte count and SHA-256 hash of the copy. It exits with code 1 and a clear error message if any check fails.

---

[Join make.fun with my referral link](https://make.fun/?ref=4w89k05q)
