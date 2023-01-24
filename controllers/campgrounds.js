const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});
const expo = module.exports;


expo.index = async (req, res)=> {
    const camps = await Campground.find({});
    // console.log(camps[0]);
    res.render('campgrounds/index', { camps });
}

expo.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

expo.renderEditForm = async (req, res) => {
    const {id} = req.params;
    // console.log(id);
    const camp = await Campground.findById(id);
    // console.log(camp);
    res.render('campgrounds/edit', {camp});
}

expo.showCampground = async (req, res)=> {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
    // console.log(camp);
    if(!camp){
        req.flash('error', "Can't find that camp.")
        res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/show', { camp });
}

expo.createCampground = async (req, res) => {
    

    // console.log(req.files);
    const {title, city, state, price, description} = req.body;
    const location = `${city}, ${state}`;
    const camp = new Campground({title, location, price, description});

    const geoData = await geoCoder.forwardGeocode({
        query: location,
        limit: 1
    }).send();
    camp.geometry = geoData.body.features[0].geometry; 

    camp.images = req.files.map(f => ({url: f.path, fileName: f.filename}));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp.images);
    console.log(camp);
    req.flash('success', 'Successfully made a new camp.')
    res.redirect(`/campgrounds/${camp._id}`);
}

expo.editCampground = async (req, res) => {
    const {id} = req.params;
    const {title, city, state, price, description} = req.body;
    const location = `${city}, ${state}`;
    const camp = await Campground.findByIdAndUpdate(id, {title, location, price, description });
    const imgs = req.files.map(f => ({url: f.path, fileName: f.filename}));
    camp.images.push(...imgs);
    if(req.body.deleteImages){
        await camp.updateOne({$pull: {images: {fileName: {$in: req.body.deleteImages} } } });
        for(let fileName of req.body.deleteImages){
            await cloudinary.uploader.destroy(fileName);
        }
    }
    await camp.save();
    console.log('\n\n\nsave')
    req.flash('success', 'Successfully edited camp.')
    res.redirect(`/campgrounds/${id}`);
    
}

expo.deleteCampground = async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted camp.')
    res.redirect('/campgrounds');
}
