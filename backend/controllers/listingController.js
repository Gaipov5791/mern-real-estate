import Listing from "../models/listingModel.js";
import errorHandler from "../utils/error.js";

const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(401, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(403, 'You can only delete your own listing!'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        next(error);
    }
};

const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, "Listing not found!")); // Corrected error code to 404
        }

        if (req.user.id !== listing.userRef) {
            return next(errorHandler(403, "You can only update your own listings!"));
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        // if (!updatedListing) {
        //     return next(errorHandler(404, "Listing not found!")); // Added error handling for no updated listing
        // }

        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};

const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Listing not found!"));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

const getSearchListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished =  { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
            type,
        })
        .sort({ [sort]: order})
        .limit(limit)
        .skip(startIndex)

        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
};


export {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getSearchListings,
};