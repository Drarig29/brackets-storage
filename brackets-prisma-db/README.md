# brackets-prisma-db

This implementation of the [`CrudInterface`](https://drarig29.github.io/brackets-docs/reference/manager/interfaces/CrudInterface.html)
uses [Prisma](https://www.prisma.io/) to store the data in a SQL database.

## Usage

To use this implementation, make sure you have [Prisma](https://www.prisma.io/) included in your project. You may follow their [Getting Started](https://www.prisma.io/docs/getting-started) guide.

Once [Prisma](https://www.prisma.io/) is included in your project, copy the [`schema.prisma`](./prisma/schema.prisma) into your project.
If you have an existing `schema.prisma` in your project copy and paste the schema definitions into your existing one.

> [!WARNING]  
> Do not rename any of the models or enums provided! This **will** break the implementation.

Next, generate the Prisma client using `npx prisma generate`.

And lastly, push the definition to your database using `npx prisma db push`.

### Minimal example

```typescript
import { SqlDatabase } from 'brackets-prisma-db';
import { BracketsManager } from 'brackets-manager';
import { PrismaClient } from '@prisma/client'

// Your Prisma client
const prisma = new PrismaClient();

const storage = new SqlDatabase(prisma);
const manager = new BracketsManager(storage);
```

### Example with custom matches and participants

```typescript
import { SqlDatabase } from 'brackets-prisma-db'
import { PrismaClient } from '@prisma/client'
import { BracketsManager } from 'brackets-manager'
import type { Match } from 'brackets-model'

type MatchWithWeather = Match & {
  // The schema defines a JSON column named `extra` in the `Match` and `MatchGame` tables.
  // Anything you put in the `extra` object will be stored in that column.
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
    // Only `name` is mandatory. All other properties are stored in the `Participant` table rows.
    { name: 'Team 1', color: 'red' },
    { name: 'Team 2', color: 'blue' },
    { name: 'Team 3', color: 'green' },
    { name: 'Team 4', color: 'yellow' },
  ],
})

const currentMatches = await manager.get.currentMatches(stage.id)

await manager.update.match<MatchWithWeather>({
  id: currentMatches[0].id,
  opponent1: { score: 6, result: 'win' },
  opponent2: { score: 3, result: 'loss' },
  extra: {
    weather: 'sunny',
  },
})
```
