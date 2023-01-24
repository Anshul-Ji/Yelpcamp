
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

// Adds first demo site
const sample = arr => arr[Math.floor(Math.random()*arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    
    for(let i = 0; i < 50; ++i){
        const random1000 =  Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*10)+30;
        const camp = new Campground({
            author: '63c310257887d16c9b484cb6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: '  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim consectetur accusantium, labore recusandae tempore possimus amet. Blanditiis facilis quas repellat nobis porro, quidem explicabo ex tempora eos, fugit ab non?',
            price,
            geometry: { 
                type: 'Point',
                coordinates: [ 75.857419, 25.173702 ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dmrakjcmw/image/upload/v1674019221/YelpCamp/nmdzo58a3b442voqzue6.png',
                  fileName: 'YelpCamp/nmdzo58a3b442voqzue6'
                }
            ]
        });
        await camp.save();
    }

}
seedDB().then(( )=> {
    mongoose.connection.close();
})

