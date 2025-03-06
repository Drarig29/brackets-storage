# brackets-sql-db

This is a partial implementation of the [`CrudInterface`](https://drarig29.github.io/brackets-docs/reference/manager/interfaces/CrudInterface.html) to use a SQL database.

Help is welcome if you made something which works in your own project! 😊

The rest of the files is missing because it was in a private project with no ORM so we created a bunch of classes manually...
To keep things simple, it would be a good idea to use an ORM instead, like [typeorm](https://github.com/typeorm/typeorm) for example.

> [!WARNING]  
> This example assumes that your IDs all start from 1 (not from 0), so it can simply check for truthiness of IDs ([example](https://github.com/Drarig29/brackets-storage/blob/b33b293efbf00c36ce428f2b1a4cac143e651b5a/brackets-sql-db/index.js#L55)).
