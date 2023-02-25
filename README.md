# Yelpcamp

Yelpcamp is a full stack web application, where users have CRUD functionality for camps and also have the ability to review them. 
This project uses:
- MongoDB - Store camp and user info
- Cloudinary API - Hosts camp images
- Mapbox API - Display maps and clustering 
- Express.js - Server
- Bootstrap - Frontend
- Node.js - Javascript Runtime
- Passport.js - Authentication
- REST - For modelling routes

## Steps to run the project

1. Create cloudinary account to get API key, secret and cloud name.
2. Create mapbox account to get API token.
3. You can create account for MongoDB to host database online or you can install mongosh locally.
4. Clone the repo and install dependencies.
    ```bash
    git clone https://github.com/Anshul-Ji/Yelpcamp.git
    cd yelpcamp
    npm install
    ```
5. Create `.env` file in root directory to add the required secrets.
    ```bash
    CLOUDINARY_CLOUD_NAME=<cloud-name>
    CLOUDINARY_KEY=<key>
    CLOUDINARY_SECRET=<secret>

    MAPBOX_TOKEN=<token>

    DB_URL=<url>
    # Local DB_URL=mongodb://127.0.0.1:27017/yelp-camp
    ```
6. Run server.
    ```bash
    node app.js
    ```
7. Head over to `http://localhost:3000/campgrounds`
