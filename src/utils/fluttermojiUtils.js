// DiceBear API Utilities - متوافق مع الويب والموبايل

const DICEBEAR_STYLES = ['avataaars', 'personas', 'lorelei', 'micah', 'bottts', 'identicon'];

export function generateDiceBearURL(seed, style = 'avataaars') {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=transparent`;
}

export function isDiceBearAvatar(avatarId) {
  return typeof avatarId === 'string' && avatarId.startsWith('https://api.dicebear.com');
}

export function getDiceBearAvatarList() {
  const avatars = [];
  
  DICEBEAR_STYLES.forEach((style) => {
    for (let i = 0; i < 4; i++) {
      const seed = `${style}-${i}-${Date.now()}`;
      const url = generateDiceBearURL(seed, style);
      avatars.push({
        id: url,
        seed,
        style,
        url
      });
    }
  });
  
  return avatars;
}