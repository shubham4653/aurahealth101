import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Appointment } from '../models/appointment.model.js';
import { Patient } from '../models/patient.model.js';
import { Provider } from '../models/provider.model.js';

const createAppointment = asyncHandler(async (req, res) => {
  const { providerId, appointmentDate, reason, time } = req.body;
  const patientId = req.patient._id;

  if (!providerId || !appointmentDate || !reason || !time) {
    throw new ApiError(400, 'All fields are required');
  }

  const patient = await Patient.findById(patientId);
  const provider = await Provider.findById(providerId);

  if (!patient || !provider) {
    throw new ApiError(404, 'Patient or Provider not found');
  }

  const appointment = await Appointment.create({ patientId, providerId, appointmentDate, reason, time });


  return res
    .status(201)
    .json(new ApiResponse(201, appointment, 'Appointment scheduled successfully'));
});

const getPatientAppointments = asyncHandler(async (req, res) => {
  const patientId = req.patient._id;
  const appointments = await Appointment.find({ patientId }).populate('providerId', 'name specialty');
  return res
    .status(200)
    .json(new ApiResponse(200, appointments, 'Appointments fetched successfully'));
});

const getProviderAppointments = asyncHandler(async (req, res) => {
  const providerId = req.provider._id;
  const appointments = await Appointment.find({ providerId }).populate('patientId', 'name email');
  return res
    .status(200)
    .json(new ApiResponse(200, appointments, 'Appointments fetched successfully'));
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, 'Status is required');
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        throw new ApiError(404, 'Appointment not found');
    }

    if (appointment.providerId.toString() !== req.provider._id.toString()) {
        throw new ApiError(403, 'You are not authorized to update this appointment');
    }

    appointment.status = status;
    await appointment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, appointment, 'Appointment status updated successfully'));
});


export { createAppointment, getPatientAppointments, getProviderAppointments, updateAppointmentStatus };
