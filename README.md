Backup assistant for dl.omnirom.org.

## __Required package__ :
    aria2 (used to download builds)

## __Install__
`npm install`

## __Usage__
`node index.js port root_folder`

`Example: node index.js 80 /home/omnirom/backup`

## __Endpoints__
* __/api__ : lists endpoints
* __/getStore__ - get apps.json content (used by OmniStore)
* __/getWallpapers__ - lists available wallpapers (used by OmniStyle)
* __/getHeaders__ - lists available headers (used by OmniStyle)
* __/getBuilds__ - lists available official builds (used by OpenDelta)

## __Syncing Resources__
###### Builds
`node sync_builds.js root_folder`

`Example: node sync_builds.js /home/omnirom/backup`

###### Wallpapers
`node sync_walls.js root_folder`

`Example: node sync_walls.js /home/omnirom/backup`

###### Headers
`node sync_headers.js root_folder`

`Example: node sync_headers.js /home/omnirom/backup`

## __TODO__
- [ ] Clean older builds while syncing
- [ ] Add store syncing
