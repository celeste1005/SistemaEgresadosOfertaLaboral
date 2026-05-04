import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    nombre: z.ZodString;
    rol: z.ZodEnum<["ADMIN", "EGRESADO", "EMPRESA"]>;
    carrera: z.ZodOptional<z.ZodString>;
    anioEgreso: z.ZodOptional<z.ZodNumber>;
    sector: z.ZodOptional<z.ZodString>;
    sitioWeb: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    ubicacion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
    nombre?: string;
    rol?: "ADMIN" | "EGRESADO" | "EMPRESA";
    carrera?: string;
    anioEgreso?: number;
    sector?: string;
    sitioWeb?: string;
    ubicacion?: string;
}, {
    email?: string;
    password?: string;
    nombre?: string;
    rol?: "ADMIN" | "EGRESADO" | "EMPRESA";
    carrera?: string;
    anioEgreso?: number;
    sector?: string;
    sitioWeb?: string;
    ubicacion?: string;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
export declare const ProfileSchema: z.ZodObject<{
    telefono: z.ZodOptional<z.ZodString>;
    direccion: z.ZodOptional<z.ZodString>;
    carrera: z.ZodOptional<z.ZodString>;
    anioEgreso: z.ZodOptional<z.ZodNumber>;
    habilidades: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    experiencia: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    carrera?: string;
    anioEgreso?: number;
    telefono?: string;
    direccion?: string;
    habilidades?: string[];
    experiencia?: string;
    linkedin?: string;
}, {
    carrera?: string;
    anioEgreso?: number;
    telefono?: string;
    direccion?: string;
    habilidades?: string[];
    experiencia?: string;
    linkedin?: string;
}>;
export declare const OfertaSchema: z.ZodObject<{
    titulo: z.ZodString;
    descripcion: z.ZodString;
    empresa: z.ZodString;
    ubicacion: z.ZodString;
    salario: z.ZodString;
    tipo: z.ZodEnum<["Full-time", "Part-time", "Contract", "Internship"]>;
    requisitos: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    ubicacion?: string;
    titulo?: string;
    descripcion?: string;
    empresa?: string;
    salario?: string;
    tipo?: "Full-time" | "Part-time" | "Contract" | "Internship";
    requisitos?: string[];
}, {
    ubicacion?: string;
    titulo?: string;
    descripcion?: string;
    empresa?: string;
    salario?: string;
    tipo?: "Full-time" | "Part-time" | "Contract" | "Internship";
    requisitos?: string[];
}>;
export declare class AuthService {
    private jwtService;
    private db;
    constructor(jwtService: JwtService, db: Pool);
    hashPassword(password: string): Promise<string>;
    validateUser(email: string, pass: string): Promise<any>;
    register(data: any): Promise<{
        success: boolean;
        message: string;
        userId: any;
    }>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            rol: any;
        };
    }>;
    eliminarUsuario(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
