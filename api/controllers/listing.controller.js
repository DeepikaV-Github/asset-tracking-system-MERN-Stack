// import Listing from '../models/listing.model.js';
// import { errorHandler } from '../utils/error.js';

// export const createListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.create(req.body);
//     console.log(listing.name);
//     return res.status(201).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };

import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import nodemailer from 'nodemailer';

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// export const createListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.create(req.body);
//     console.log(listing.name);

//     // Prepare the email content
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: 'athrvx51@gmail.com', // Replace with the recipient's email address
//       subject: 'New Listing Created',
//       html: `<p>A new listing has been created:</p>
//              <p>Name: ${listing.name}</p>
//              <p>Description: ${listing.description}</p>`, // Customize the email content as needed

//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);
//     console.log("Email Sent Successfully!!!");
    

//     return res.status(201).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.create(req.body);
//     console.log(listing.name);

//     // Prepare the email content with Accept and Reject buttons
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: 'athrvx51@gmail.com', // Replace with the recipient's email address
//       subject: 'New Listing Created',
//       html: `<p>A new listing has been created:</p>
//              <p>Name: ${listing.name}</p>
//              <p>Description: ${listing.description}</p>
//              <p>
//                <a href="${process.env.BASE_URL}/accept/${listing._id}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Accept</a>
//                <a href="${process.env.BASE_URL}/reject/${listing._id}" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none;">Reject</a>
//              </p>`, // Customize the email content as needed
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);
//     console.log("Email Sent Successfully!!!");

//     return res.status(201).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    console.log(listing.name);

    // Prepare the email content with Accept and Reject buttons
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ['athrvx51@gmail.com', 'deepika.v2106@gmail.com'], // Replace with the managers' email addresses
      subject: 'New Listing Created',
      html: `<p>A new listing has been created:</p>
             <p>Name: ${listing.name}</p>
             <p>Description: ${listing.description}</p>
             <p>
               <a href="${process.env.BASE_URL}/accept/${listing._id}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Accept</a>
               <a href="${process.env.BASE_URL}/reject/${listing._id}" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none;">Reject</a>
             </p>`, // Customize the email content as needed
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email Sent Successfully!!!");

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};


export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
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
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
