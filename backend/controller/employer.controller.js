import mongoose from "mongoose";
import CompanyProfile from "../model/companyProfile.model.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import fs from 'fs';
import path from 'path';

const employerController = {};


/**
 * Retrieves all company profiles (accessible to admins and superadmins)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
employerController.getAllCompanyProfiles = async (req, res, next) => {
  try {
    // Fetch all company profiles, excluding the version key
    const profiles = await CompanyProfile.find().select('-__v');
    return res.status(200).json({
      success: true,
      profiles
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Creates a company profile for an authenticated employer
 * @param {Object} req - Request object containing employer data
 * @param {Object} res - Response object to send back the result
 * @param {Function} next - Next middleware function
 */
employerController.createCompanyProfile = async (req, res, next) => {
  try {
    const employerId = req.user.id;
    const { 
      companyName, email, phone, website, establishedSince, 
      teamSize, categories, allowInSearch, description, 
      socialMedia, location, industry, companyType, culture, 
      revenue, founders, branches, isHiring
    } = req.body;

    // Validate required fields
    const requiredFields = ['companyName', 'email', 'phone', 'establishedSince', 
                           'teamSize', 'categories', 'description', 'industry', 'companyType'];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      throw new BadRequestError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Check if profile already exists
    const existingProfile = await CompanyProfile.findOne({ employer: employerId });
    if (existingProfile) {
      throw new BadRequestError('Company profile already exists for this employer');
    }

    // Handle file uploads
    const files = req.files || {};
    const logo = files.logo ? `/uploads/company/${files.logo[0].filename}` : null;
    const coverImage = files.coverImage ? `/uploads/company/${files.coverImage[0].filename}` : null;

    // Create new profile
    const newProfile = new CompanyProfile({
      employer: employerId,
      companyName,
      email,
      phone,
      website,
      establishedSince,
      teamSize,
      categories: Array.isArray(categories) ? categories : [categories],
      allowInSearch: allowInSearch !== undefined ? allowInSearch : true,
      description,
      socialMedia: socialMedia ? JSON.parse(socialMedia) : {},
      location: location ? JSON.parse(location) : {},
      industry,
      companyType,
      culture: culture ? JSON.parse(culture) : [],
      revenue,
      founders: founders ? JSON.parse(founders) : [],
      branches: branches ? JSON.parse(branches) : [],
      isHiring: isHiring !== undefined ? isHiring : false,
      logo,
      coverImage
    });

    await newProfile.save();

    return res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      profile: newProfile
    });
  } catch (error) {

    // Cleanup uploaded files if an error occurs after upload
    if (req.files) {
      const files = req.files;
      if (files.logo && files.logo[0]) {
        const logoPath = path.join(process.cwd(), 'public', `/uploads/company/${files.logo[0].filename}`);
        if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
      }
      if (files.coverImage && files.coverImage[0]) {
        const coverPath = path.join(process.cwd(), 'public', `/uploads/company/${files.coverImage[0].filename}`);
        if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
      }
    }

    next(error);
  }
};

// Update company profile
employerController.updateCompanyProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const profileId = req.params.id;
    const updateData = req.body;
    const files = req.files || {};

    // Find the profile by ID
    const profile = await CompanyProfile.findById(profileId);
    if (!profile) {
      throw new NotFoundError('Company profile not found');
    }

    // Check permissions
    if (user.role !== 'superadmin' && profile.employer.toString() !== user.id) {
      throw new ForbiddenError('You do not have permission to update this profile');
    }

    // Handle file uploads only if provided
    if (files.logo) {
      if (profile.logo) {
        const oldLogoPath = path.join(process.cwd(), 'public', profile.logo);
        if (fs.existsSync(oldLogoPath)) fs.unlinkSync(oldLogoPath);
      }
      updateData.logo = `/uploads/company/${files.logo[0].filename}`;
    }

    if (files.coverImage) {
      if (profile.coverImage) {
        const oldCoverPath = path.join(process.cwd(), 'public', profile.coverImage);
        if (fs.existsSync(oldCoverPath)) fs.unlinkSync(oldCoverPath);
      }
      updateData.coverImage = `/uploads/company/${files.coverImage[0].filename}`;
    }

    // Parse JSON fields
    const jsonFields = ['socialMedia', 'location', 'culture', 'founders', 'branches'];
    jsonFields.forEach(field => {
      if (updateData[field]) {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          throw new BadRequestError(`Invalid format for ${field}`);
        }
      }
    });

    // Handle categories array
    if (updateData.categories) {
      updateData.categories = Array.isArray(updateData.categories) 
        ? updateData.categories 
        : [updateData.categories];
    }

    // Update profile
    const updatedProfile = await CompanyProfile.findByIdAndUpdate(
      profileId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    // Cleanup uploaded files if an error occurs
    if (req.files) {
      const files = req.files;
      if (files.logo && files.logo[0]) {
        const logoPath = path.join(process.cwd(), 'public', `/uploads/company/${files.logo[0].filename}`);
        if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
      }
      if (files.coverImage && files.coverImage[0]) {
        const coverPath = path.join(process.cwd(), 'public', `/uploads/company/${files.coverImage[0].filename}`);
        if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
      }
    }
    next(error);
  }
};

// Get company profile
employerController.getCompanyProfile = async (req, res, next) => {
  try {
    const profileId = req.params.id;
    
    const profile = await CompanyProfile.findById(profileId);
    if (!profile) {
      throw new NotFoundError('Company profile not found');
    }

    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Deletes a company profile and associated files
 * @param {Object} req - Request object containing profile ID and user info
 * @param {Object} res - Response object to send back the result
 * @param {Function} next - Next middleware function
 */
employerController.deleteCompanyProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const profileId = req.params.id;

    // Find the profile by ID
    const profile = await CompanyProfile.findById(profileId);
    if (!profile) {
      throw new NotFoundError('Company profile not found');
    }

    // Check permissions: only superadmin or profile owner can delete
    if (user.role !== 'superadmin' && profile.employer.toString() !== user.id) {
      throw new ForbiddenError('You do not have permission to delete this profile');
    }

    // Delete associated files if they exist
    if (profile.logo) {
      const logoPath = path.join(process.cwd(), 'public', profile.logo);
      try {
        await fs.unlink(logoPath);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          console.error(`Failed to delete logo: ${err.message}`);
        }
      }
    }

    // if (profile.coverImage) {
    //   const coverPath = path.join(process.cwd(), 'public', profile.coverImage);
    //   try {
    //     await fs.unlink(coverPath);
    //   } catch (err) {
    //     if (err.code !== 'ENOENT') {
    //       console.error(`Failed to delete cover image: ${err.message}`);
    //     }
    //   }
    // }

    // Delete the profile from the database
    await CompanyProfile.findByIdAndDelete(profileId);

    return res.status(200).json({
      success: true,
      message: 'Company profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export default employerController;