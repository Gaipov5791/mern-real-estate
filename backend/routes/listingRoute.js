import expess from 'express';
import verifyToken from '../utils/verifyUser.js';
import { 
    createListing, 
    deleteListing, 
    updateListing, 
    getListing, 
    getSearchListings } from '../controllers/listingController.js';

const router = expess.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/getListing/:id', getListing);
router.get('/getListings', getSearchListings);

export default router;