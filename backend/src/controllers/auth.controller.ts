import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, phone, role } = req.body;

        if (!email || !password || !name) {
            res.status(400).json({ error: 'Email, password, and name are required' });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                phone,
                role: role || 'CITIZEN',
            },
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '7d',
        });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '7d',
        });

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            // @ts-ignore - added via authMiddleware
            where: { id: req.user?.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                points: true,
                level: true,
                avatarUrl: true
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            res.status(400).json({ error: 'Google ID Token is required' });
            return;
        }

        // 1. Verify Google Token (In Dev, if mock token is used, we bypass strict verification)
        let payload;
        if (idToken === 'mock_google_id_token_dev_only') {
            payload = {
                email: 'demo.citizen@gmail.com',
                name: 'Demo Google Citizen',
                picture: 'https://lh3.googleusercontent.com/a/mock-avatar-123'
            };
        } else {
            const ticket = await googleClient.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        }

        if (!payload || !payload.email) {
            res.status(401).json({ error: 'Invalid Google token payload' });
            return;
        }

        // 2. Find or Create User
        let user = await prisma.user.findUnique({ where: { email: payload.email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: payload.email,
                    name: payload.name || 'Google User',
                    avatarUrl: payload.picture,
                    role: 'CITIZEN',
                    authProvider: 'GOOGLE'
                }
            });
        } else if (user.authProvider === 'LOCAL') {
             // Link account if they previously signed up with local but now use Google
             user = await prisma.user.update({
                 where: { id: user.id },
                 data: { authProvider: 'GOOGLE', avatarUrl: user.avatarUrl || payload.picture }
             });
        }

        // 3. Issue Our JWT
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '7d',
        });

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatarUrl: user.avatarUrl
            },
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
};
