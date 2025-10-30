# brackets-prisma-db

This implementation of the [`CrudInterface`](https://drarig29.github.io/brackets-docs/reference/manager/interfaces/CrudInterface.html)
uses [prisma](https://www.prisma.io/) to store the data in an SQL Database.

## Usage

To use this implementation make sure you have [prisma](https://www.prisma.io/) included in your project.
A Guide on how to include prisma in your project can be found on the official documentation page.

Once [prisma](https://www.prisma.io/) is included in your project copy the [`schema.prisma`](./prisma/schema.prisma) into your project.
If you have an existing `schema.prisma` in your project copy and paste the schema definitions into your existing one.

> [!WARNING]  
> Do not rename any of the models or enums provided! This **will** break the implementation.

Next generate the prisma client using `npx prisma generate`.
Lastly push the definition to your database using `npx prisma db push`.

```typescript
import { SqlDatabase } from 'brackets-prisma-db';
import { BracketsManager } from 'brackets-manager';
import { PrismaClient } from '@prisma/client'

// Your Prisma client
const prisma = new PrismaClient();

const storage = new SqlDatabase(prisma);
const manager = new BracketsManager(storage);
```

Example with custom matches and participants:

```typescript
import { SqlDatabase } from 'brackets-prisma-db'
import { PrismaClient } from '@prisma/client'
import { BracketsManager } from 'brackets-manager'
import type { Match } from 'brackets-model'

type MatchWithWeather = Match & {
  extra: {
    weather: 'sunny' | 'rainy' | 'cloudy' | 'snowy'
  }
}

const storage = new SqlDatabase(new PrismaClient())
const manager = new BracketsManager(storage)

const stage = await manager.create.stage({
  tournamentId: 1,
  name: 'Example',
  type: 'single_elimination',
  seeding: [
    { name: 'Team 1', color: 'red' },
    { name: 'Team 2', color: 'blue' },
    { name: 'Team 3', color: 'green' },
    { name: 'Team 4', color: 'yellow' },
  ],
})

const currentMatches = await manager.get.currentMatches(stage.id)

await manager.update.match<MatchWithWeather>({
  id: currentMatches[0].id,
  opponent1: { result: 'win' },
  extra: {
    weather: 'sunny',
  },
})

const database = await manager.get.tournamentData(1)
console.log(database)
```
