const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    // const allListings = await Listing.find({});
    let {tag} = req.query;
    let query = {};
    if(tag && tag!= 'all'){
        query = {tags: tag};
    }
    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings });
}
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate: {
                path:"author"
            },
        }).populate("owner");
    if(!listing){
        req.flash("error", "This listing doesnot exists!");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing =async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    if (newListing.tags && !Array.isArray(newListing.tags)) {
        newListing.tags = [newListing.tags];
    } else if (!newListing.tags) {
        newListing.tags = [];
    }
    await newListing.save();
    req.flash("success", "Listing added ✔ ");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "This listing doesnot exists!");
        res.redirect("/listings")
    }
    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/c_fill,h_100,w_120");

    if (!Array.isArray(listing.tags)) {
        listing.tags = [listing.tags];
    }

    res.render("listings/edit.ejs", { listing , orignalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Changes saved ✔ ");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully ✔ ");
    res.redirect("/listings");
}