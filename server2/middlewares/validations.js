import mongoose from 'mongoose';
import {z} from 'zod';
import Employee from '../models/employeeSchema.js';

export const createEmployeeValidation = z.object({
  username: z.string().min(8).regex(/^\S*$/, 'Username should not contain spaces'),
  firstName: z.string().min(3).max(15),
  lastName: z.string().min(3).max(15),
  dob: z.string().datetime({offset: true}),
  password: z.string().min(8)
});
export const updateEmployeeValidation = createEmployeeValidation.partial();

const createEmployeeProfileValidation = z.object({
  title: z.string(),
  description: z.string(),
  yearOfExperience: z.number(),
  department: z.string(),
  phone: z.string(),
  email: z.string().email()
});
export const updateEmployeeProfileValidation = createEmployeeProfileValidation.partial();

export const createLeaveValidation = z.object({
  empId: z.string().refine(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const employee = await Employee.findById(id);
    return employee !== null;
  }, {message: 'Invalid employee ID'}),
  type: z.enum(['annual', 'casual', 'sick']),
  duration: z.number().min(1),
  status: z.enum(['inProgress', 'cancelled', 'ended'])
});
export const updateLeaveValidation = createLeaveValidation.partial();