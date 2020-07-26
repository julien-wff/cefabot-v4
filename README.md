# Cefabot v4

The 4<sup>th</sup> version of my discord bot, with multiple bot clients support, and a web panel


## Development

#### Main packages :

- The bot :
    - Typescript
    - Mongoose for the DB
    - DiscordJS to communicate with the bots
    - Express for the web
- The web panel :
    - SvelteJS
    - Tailwind CSS
    - Sweet alert 2

#### Workspace :

- `/src` : the source directory for the bot
- `/web` : the directory for the web panel front-end


## Usage

The following environment variables are needed :

Variable | Description
-------- | -------------
NODE_ENV | `dev` or `prod`
BOT_KEY | Bots encryption key used to secure the keys in the DB
DB_URI | The URI of the mongoDB server
STORAGE_PATH | The path to store uploaded files, absolute or relative to the project root
WEB_BASE_URL | The root URL of the web server (ex: http://host.ext, or https://192.168.1.2:8000) 
WEB_PORT | The port of the web panel

You can use a `.env` file at the root of the project.

If some variables are missing, the bot will crash at starting.


## Compilation and production

TODO
