# Exhibition Center
An Exhibition center in the city hosts 
various events throughout the year, at
multiple locations. These events are of
different types: social, fundraising,
tech talks, arts and craft etc. At the
moment, each person who wishes to attend
an event has to create a unique login on
every different event host’s website, in
order to add each event to his/her calendar.
The Exhibition center’s management wants a
website that would present all the different
events on its own main website, which would
facilitate different event managers/hosts
to present their details on it, and event
attendees to sign-up for these events.
## User Types
### Super Admin
Super Admins cannot sign up or register an account.
Super Admin is a special login given to the developers
to access more information.
 - Look up the information about events organized by a particular Admin.
 - List the events (the event titles) a particular user has participated.
### Regular User
Regular Users can view, register for, and create events.
#### Types of Searches
 - Search by Start and End Time.
   - List the event titles, and their URL based on an event start date,
   and an event end date. Any event falls within this time period is displayed.
 - Search by City
   - List the event titles and their URL for currently active events in a particular city.
#### Create Events
 - Step 1: Create a website for the event independent of this online service.
 - Step 2: Provide the following event-related information to your online service.
   - Event title
   - Event description
   - The URL of the event homepage created in Step 1
   - Event start date
   - Event end date
   - Event address (Needs a city here to complete search requirement)
 - Step 3: Submit the event. (The event will be approved for listing
 with our online service if no conflicts).
## Setup Guide: Local Development
### Prerequisites
#### NVM
We use NVM to manage Node versions.
Follow the installation instructions at:

> https://github.com/nvm-sh/nvm#installing-and-updating
___
### Installation
#### Install correct node version using:
```shell script
nvm install v12.18.2
```
#### Clone Repo and install node packages
```shell script
git clone https://github.com/joelbolt35/Exhibition-Center-API
cd Exhibition-Center-API
nvm use
npm ci
```
#### Add in environment variables to root directory
`/Exhibition-Center-API/.env`

You will need to get the content for the `.env` file from one of the developers.
___
### Run Development
This will run nodemon and watch for changes in the `server` and `views` folders.
```shell script
npm run dev
```
___
### Run Production
First build the `/dist` folder.
```shell script
npm run build
```
Then run production build using
```shell script
npm run start
```