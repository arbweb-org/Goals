# Goals Manager

Personal goals manager built with nodejs and angular

## Features

- Homepage lists public goals.
- Dashboard for goals CRUD operations.
- Reorder goals.
- Nest goals.
- Login and register.
- Hash passwords.

## Constraints

- Prevent nesting deeper than 2 levels (at both client and server).
- Prevent cyclic nesting.
- Deleting a goal deletes its descendants.
- Setting a goal public sets its descendants.
- Goal can be reordered only under its parent.

## Getting Started

### Prerequisites

- Node.js >= 18.x
- Angular
- PostgreSQL

### Deployment

- Create a PostgreSQL database.
- Configure db connection parameters in 'Goals\goals.server\src\app.module.ts'.
- Navigate to 'Goals\goals.client' folder.
- Run the cli command: 'g build --output-path=../goals.server/public'.
- Navigate to 'Goals\goals.server' folder.
- Run the cli command: 'npm run start', server will start on localhost:3000.

### How to use the app

- Register.
- Login.
- In dashboard, add new goals.
- Edit or delete a goal.
- Set a goal public.
- Reorder a goal by draging and dropping it over the space between other goals.
- Nest a goal by draging and dropping it over the new parent goal.

## Known bugs and limitations

- No user input validation in dashboard.
- No database transaction implemented.
- Date input doesnt bind correctly when update Goal object.
- Public goals are read only.
- All public goals are at the top level.

## Further improvements

- Add db transaction.
