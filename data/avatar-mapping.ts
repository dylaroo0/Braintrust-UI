import { DesignerIcon, DeveloperIcon, EngineerIcon, OrganizerIcon } from '../components/icons';

/**
 * Mapping of avatar types to their corresponding React components
 * This maintains the connection between database avatar_type and UI components
 */
export const AVATAR_COMPONENTS = {
  designer: DesignerIcon,
  developer: DeveloperIcon,
  engineer: EngineerIcon,
  organizer: OrganizerIcon,
} as const;

export type AvatarType = keyof typeof AVATAR_COMPONENTS;

/**
 * Get the avatar component for a given avatar type
 */
export function getAvatarComponent(avatarType: AvatarType) {
  return AVATAR_COMPONENTS[avatarType];
}