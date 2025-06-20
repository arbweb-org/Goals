# Goals Manager

Personal goals manager built with nodejs and angular

## Features

- Dashboard for goals CRUD operations.
- Reorder goals.
- Nest goals.
- Login and register.

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

## Known bugs and limitations

- No user input validation.
- Users api not implemented storage in database.
- No user session persistence.
- No database transaction implemented.
- Inaccurate Goal deadline date when create new or updated.
- Date input doesnt bind correctly when update Goal object.

## Further improvements

- Add JWT auth.
- Implement public goals page and api.
- Add detailed error message.
- Use ISO date.




