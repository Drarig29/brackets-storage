# brackets-memory-db

This implementation of the [`CrudInterface`](https://drarig29.github.io/brackets-docs/reference/manager/interfaces/CrudInterface.html) allows you to store the database directly in memory.

This is a good choice if you want to have both the [manager](https://github.com/Drarig29/brackets-manager.js) and the [viewer](https://github.com/Drarig29/brackets-viewer.js) to run in the browser.

You can also use it to do all the logic in memory and persist the new state at the end of an update, for example.

It is used in the documentation here: https://drarig29.github.io/brackets-docs/getting-started/#using-the-viewer
