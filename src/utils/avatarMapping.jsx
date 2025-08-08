import React from 'react';
import Icon from '@mdi/react';
import {
  mdiAccount,
  mdiAccountCircle,
  mdiHeart,
  mdiStar,
  mdiHome,
  mdiPhone,
  mdiEmail,
  mdiCog
} from '@mdi/js';

export const avatarMapping = {
  doctor_blue: { icon: mdiHome, color: '#2563eb' },
  hospital_green: { icon: mdiPhone, color: '#16a34a' },
  healing_red: { icon: mdiEmail, color: '#dc2626' },
  health_purple: { icon: mdiCog, color: '#9333ea' },
  person_orange: { icon: mdiAccount, color: '#ea580c' },
  face_teal: { icon: mdiAccountCircle, color: '#0d9488' },
  account_indigo: { icon: mdiAccountCircle, color: '#4f46e5' },
  person_brown: { icon: mdiAccount, color: '#a3a3a3' },
  emoji_amber: { icon: mdiStar, color: '#f59e0b' },
  happy_pink: { icon: mdiHeart, color: '#ec4899' },
  heart_red: { icon: mdiHeart, color: '#dc2626' },
  star_yellow: { icon: mdiStar, color: '#eab308' },
  pets_brown: { icon: mdiHome, color: '#a3a3a3' },
  paw_green: { icon: mdiPhone, color: '#16a34a' },
  eco_green: { icon: mdiEmail, color: '#16a34a' },
  flower_pink: { icon: mdiHeart, color: '#ec4899' },
  android_green: { icon: mdiCog, color: '#16a34a' },
  computer_blue: { icon: mdiAccount, color: '#2563eb' },
  soccer_black: { icon: mdiAccountCircle, color: '#000000' },
  fitness_red: { icon: mdiStar, color: '#dc2626' }
};

export const getAvatarIcon = (avatarId) => {
  return avatarMapping[avatarId] || { icon: mdiAccount, color: '#6b7280' };
};

export const AvatarIcon = ({ avatarId, size = 24 }) => {
  const avatar = getAvatarIcon(avatarId);
  return <Icon path={avatar.icon} size={size / 24} color={avatar.color} />;
};