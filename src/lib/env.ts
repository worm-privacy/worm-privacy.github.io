import dotenv from 'dotenv';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

import { formatZodError } from './zod';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config({ path: path.resolve(__dirname, '../.env') });

type Settings = Record<string, string | undefined>;

type NamespacedSettings = Record<string, Settings>;

/**
 * Gets a specific environment variable
 * @param {string} key - The environment variable key
 * @param {string} [defaultValue] - Optional default value if key doesn't exist
 * @returns {string|undefined} The environment variable value or default value
 */
export function getEnvVariable(key: keyof EnvVars, defaultValue?: string) {
  const exists = hasEnvVariable(key);
  if (exists) {
    return process.env[key] as string;
  }

  if (!exists && defaultValue) {
    return defaultValue;
  }

  throw new Error(`Error in getEnvVariable: key ${key} does not exists`);
}

/**
 * Checks if a specific environment variable exists
 * @param {string} key - The environment variable key
 * @returns {boolean} True if the environment variable exists
 */
export function hasEnvVariable(key: string): boolean {
  return key in process.env;
}

export function parseNamespacedSettings(env: Settings): NamespacedSettings {
  const namespaced: NamespacedSettings = {};

  for (const [key, value] of Object.entries(env)) {
    if (!value) continue;

    const [namespace, ...rest] = key.split('.');
    if (!namespace || rest.length === 0) continue;

    const settingKey = rest.join('.');
    namespaced[namespace] = namespaced[namespace] || {};
    namespaced[namespace][settingKey] = value;
  }

  return namespaced;
}

/**
 * Recursively searches for a .env file starting from the current directory
 * and moving up through parent directories (Node.js only)
 * @param {string} [startDir=process.cwd()] - Starting directory for the search
 * @returns {string|null} Path to the nearest .env file or null if not found
 */
export function findNearestEnvFile(startDir = process.cwd()) {
  let currentDir = startDir;
  while (currentDir !== path.parse(currentDir).root) {
    const envPath = path.join(currentDir, '.env');

    if (fs.existsSync(envPath)) {
      return envPath;
    }

    currentDir = path.dirname(currentDir);
  }

  const rootEnvPath = path.join(path.parse(currentDir).root, '.env');
  return fs.existsSync(rootEnvPath) ? rootEnvPath : null;
}

export const envVarsSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

});

export type EnvVars = z.infer<typeof envVarsSchema>;
export const envVars = envVarsSchema.safeParse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvVars {}
  }
}

export function getEnv(): Readonly<EnvVars> {
  if (envVars.success === false) {
    throw formatZodError(envVars.error);
  }

  return {
    NODE_ENV: envVars.data.NODE_ENV,
    PORT: envVars.data.PORT,

  } as const;
}
