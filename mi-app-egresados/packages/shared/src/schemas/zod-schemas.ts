import { z } from 'zod';
import { UserRole } from '../enums/user-role.enum';
import { ApplicationStatus } from '../enums/application-status.enum';
import { WorkModality } from '../enums/work-modality.enum';

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  rol: z.nativeEnum(UserRole),
});

export const CreateApplicationSchema = z.object({
  ofertaId: z.string().uuid(),
  egresadoId: z.string().uuid(),
});

export const UpdateApplicationStatusSchema = z.object({
  estado: z.nativeEnum(ApplicationStatus),
  comentarios: z.string().optional(),
});
