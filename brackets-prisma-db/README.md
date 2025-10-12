# brackets-prisma-db

This implementation of the [`CrudInterface`](https://drarig29.github.io/brackets-docs/reference/manager/interfaces/CrudInterface.html)
uses [prisma](https://www.prisma.io/) to store the data in an SQL Database.

> **Warning**
> This implementation has not been full tested yet. Use with caution.

## Limitations

Currently there are some features of the [manager](https://github.com/Drarig29/brackets-manager.js) that can't be used.

| **Feature**         | **Status**      |
| ------------------- | --------------- |
| Custom Participants | Implemented     |
| Custom Matches      | Not Implemented |

## Usage

To use this implementation make sure you have [prisma](https://www.prisma.io/) included in your project.
A Guide on how to include prisma in your project can be found on the official documentation page.

Once [prisma](https://www.prisma.io/) is included in your project copy the [`schema.prisma`](./prisma/schema.prisma) into your project.
If you have an existing `schema.prisma` in your project copy and paste the schema definitions into your existing one.

> **Warning**
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
