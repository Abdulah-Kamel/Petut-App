import Icon from '@mdi/react';
import {
  mdiMedicalBag,
  mdiHospitalBuilding,
  mdiHealing,
  mdiShieldCross,
  mdiAccount,
  mdiFace,
  mdiAccountCircle,
  mdiAccountOutline,
  mdiEmoticonHappy,
  mdiEmoticonExcited,
  mdiHeart,
  mdiStar,
  mdiPaw,
  mdiLeaf,
  mdiFlower,
  mdiAndroid,
  mdiLaptop,
  mdiSoccer,
  mdiDumbbell
} from '@mdi/js';

export const avatarMapping = {
  doctor_blue: { icon: mdiMedicalBag, color: '#2563eb' },
  hospital_green: { icon: mdiHospitalBuilding, color: '#16a34a' },
  healing_red: { icon: mdiHealing, color: '#dc2626' },
  health_purple: { icon: mdiShieldCross, color: '#9333ea' },
  person_orange: { icon: mdiAccount, color: '#ea580c' },
  face_teal: { icon: mdiFace, color: '#0d9488' },
  account_indigo: { icon: mdiAccountCircle, color: '#4f46e5' },
  person_brown: { icon: mdiAccountOutline, color: '#a3a3a3' },
  emoji_amber: { icon: mdiEmoticonHappy, color: '#f59e0b' },
  happy_pink: { icon: mdiEmoticonExcited, color: '#ec4899' },
  heart_red: { icon: mdiHeart, color: '#dc2626' },
  star_yellow: { icon: mdiStar, color: '#eab308' },
  pets_brown: { icon: mdiPaw, color: '#a3a3a3' },
  paw_green: { icon: mdiPaw, color: '#16a34a' },
  eco_green: { icon: mdiLeaf, color: '#16a34a' },
  flower_pink: { icon: mdiFlower, color: '#ec4899' },
  android_green: { icon: mdiAndroid, color: '#16a34a' },
  computer_blue: { icon: mdiLaptop, color: '#2563eb' },
  soccer_black: { icon: mdiSoccer, color: '#000000' },
  fitness_red: { icon: mdiDumbbell, color: '#dc2626' }
};

export const getAvatarIcon = (avatarId) => {
  return avatarMapping[avatarId] || { icon: mdiAccount, color: '#6b7280' };
};

import React from 'react';

export const AvatarIcon = ({ avatarId, size = 24 }) => {
  const avatar = getAvatarIcon(avatarId);
  return React.createElement(Icon, {
    path: avatar.icon,
    size: size / 24,
    color: avatar.color
  });
};