// admin.routes.js
import { Router } from 'express';
import adminController from '../controller/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const adminRouter = Router();

// userRouter.get('/profile', authenticate, authorize(['candidate', 'admin', 'superadmin']), userController.getProfile);

// Admin dashboard: Accessible to admins and superadmins
adminRouter.get('/dashboard', authenticate, authorize(['admin', 'superadmin']), adminController.getAdminDashboard);

// View all candidates: Accessible to admins and superadmins
adminRouter.get('/candidates', authenticate, authorize(['admin', 'superadmin']), adminController.getAllCandidates);

// Superadmin dashboard: Accessible only to superadmins
adminRouter.get('/superadmin/dashboard', authenticate, authorize(['superadmin']), adminController.getSuperadminDashboard);

// View all users (including admins): Accessible only to superadmins
adminRouter.get('/superadmin/users', authenticate, authorize(['superadmin']), adminController.getAllUsers);

// Toggle user activation status (activate/deactivate): Accessible only to superadmins
adminRouter.patch('/superadmin/users/:id/toggle-activation', authenticate, authorize(['superadmin']), adminController.toggleUserActivation);

export default adminRouter;