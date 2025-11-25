/**
 * Services Index
 *
 * Centralized export for all service modules.
 * Import services from this file for cleaner imports.
 *
 * Example usage:
 * import { comicService, authService } from '../services';
 * const comics = await comicService.getAllComics();
 */

export { default as api } from "./api";
export { default as comicService } from "./comicService";
export { default as authService } from "./authService";

// Named exports for individual functions
export * from "./api";
export * from "./comicService";
export * from "./authService";
