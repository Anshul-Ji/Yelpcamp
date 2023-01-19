const Campground = require('../models/campground');
const Review = require('../models/review');
const expo = module.exports;


expo.createReview = async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const pushed = await camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Created new review.')
    res.redirect(`/campgrounds/${id}`);
}


expo.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review.')
    res.redirect(`/campgrounds/${id}`);
}