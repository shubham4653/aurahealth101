import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Permission } from '../models/permission.model.js';

// Patient: add or update a permission for a provider
const upsertPermission = asyncHandler(async (req, res) => {
  const patientId = req.patient._id;
  const { providerId, documentType = 'All', scope = 'Full Record', isActive = true } = req.body;

  if (!providerId) {
    throw new ApiError(400, 'providerId is required');
  }

  const permission = await Permission.findOneAndUpdate(
    { patientId, providerId },
    { documentType, scope, isActive },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate('providerId', 'name email walletAddress');

  return res.status(200).json(new ApiResponse(200, permission, 'Permission saved'));
});

// Patient: list permissions
const listPatientPermissions = asyncHandler(async (req, res) => {
  const patientId = req.patient._id;
  const list = await Permission.find({ patientId }).populate('providerId', 'name email walletAddress');
  return res.status(200).json(new ApiResponse(200, list, 'Permissions fetched'));
});

// Patient: toggle active
const togglePermission = asyncHandler(async (req, res) => {
  const patientId = req.patient._id;
  const { providerId, isActive } = req.body;
  if (!providerId || typeof isActive !== 'boolean') {
    throw new ApiError(400, 'providerId and isActive required');
  }
  const perm = await Permission.findOneAndUpdate({ patientId, providerId }, { isActive }, { new: true });
  if (!perm) throw new ApiError(404, 'Permission not found');
  return res.status(200).json(new ApiResponse(200, perm, 'Permission updated'));
});

// Provider: list patients who granted access
const listProviderPermissions = asyncHandler(async (req, res) => {
  const providerId = req.provider._id;
  const list = await Permission.find({ providerId, isActive: true }).populate('patientId', 'fullName email');
  return res.status(200).json(new ApiResponse(200, list, 'Granted permissions fetched'));
});

export { upsertPermission, listPatientPermissions, togglePermission, listProviderPermissions };


