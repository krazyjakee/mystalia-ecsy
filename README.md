# Mystalia Engine

## Installation

- Clone repo
- `npm i` to install dependencies
- Install and run [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
- Rename the file `.env.example` to `.env` in the root directory

## Getting started

### Development mode

- To run in development mode: `npm start`
- Visit webpack-dev-server (with hot reload) at http://localhost:8081
- Visit server (without hot reload) at http://localhost:8080

- To run in production mode: `npm run start:prod`
- Visit the production server at http://localhost:8080

### Database migrations

- When starting from scratch, mongodb wont need to run migrations and can ignore the following
- If DB changes happen, make sure database migrations are up-to-date
- Run `migrate-mongo up` to migrate to the latest
- Run `migrate-mongo create` to create a new migration

### Contribution Etiquette

- Please make a pull request for every contribution
- Please see [PR Review etiquette here](https://github.com/thoughtbot/guides/tree/master/code-review)
- We are all responsible for code structure and quality, [if you see a problem, fix it](https://deviq.com/boy-scout-rule/).

### Tools

- Autotile to Tiled Terrain: https://codesandbox.io/s/autotile-to-tiled-i3k2r
- Merge PNGs Together: https://codesandbox.io/s/merge-pngs-together-m1elh
