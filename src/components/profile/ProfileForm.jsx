import React, { useState, useEffect } from "react";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, setUserProfile } from "../../firebase";
import ProfileImageManager from "./ProfileImageManager";
import AvatarSelectionModal from "./AvatarSelectionModal";

const ProfileForm = ({ currentUser }) => {
  const { authUser } = useAuth ? useAuth() : { authUser: null };
  const [fullName, setFullName] = useState(currentUser?.displayName || "");
  const [email] = useState(currentUser?.email || "");
  const [gender,setGender] = useState("");
  const [phone, setPhone] = useState( "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState( ""); // base64 for preview
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  async function fetchProfile() {
    if (currentUser?.uid) {
      const profile = await getUserProfile(currentUser.uid);
      if (profile) {
        setPhone(profile.phone || "");
        setProfileImage(profile.profileImage || "");
        setGender(profile.gender || "");
      }
    }
  }
  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle image upload and convert to base64
  const handleImageChange = (file) => {
    if (!file) return;

    setProfileImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result); // base64 string for preview
    };
    reader.readAsDataURL(file);
  };

  const handleImageDelete = () => {
    setProfileImage("");
    setProfileImageFile(null);
  };

  const handleAvatarSelect = (avatarId) => {
    setProfileImage(avatarId);
    setProfileImageFile(null);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setLoading(true);
    try {
      if (currentUser) {
        let imageUrl = profileImage; // Keep existing image if no new one is uploaded

        // Only upload to imgbb if it's a new file (not an avatar ID)
        if (profileImageFile) {
          const apiKey = "01a0445653bd47247515dce07a3f1400";
          const formData = new FormData();
          formData.append("image", profileImageFile);

          const response = await fetch(
            `https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`,
            {
              method: "POST",
              body: formData,
            }
          );

          const result = await response.json();

          if (result.success) {
            imageUrl = result.data.url;
          } else {
            throw new Error(result.error.message || "Image upload failed");
          }
        }
        // If it's a DiceBear URL or regular avatar ID, keep it as is
        else if (profileImage && typeof profileImage === 'string' && 
                (profileImage.startsWith('https://api.dicebear.com') || profileImage.includes('_'))) {
          imageUrl = profileImage;
        }

        // Save to Firestore
        const profileData = {
          fullName,
          phone,
          profileImage: imageUrl,
          gender,
        };
        console.log('Saving profile data:', profileData);
        await setUserProfile(currentUser.uid, profileData);
        console.log('Profile saved successfully');

        // Optionally update displayName in Auth
        await updateProfile(currentUser, {
          displayName: fullName,
        });

        setProfileImage(imageUrl); // Update local state with the new image URL
        setProfileMsg("تم تحديث الملف الشخصي بنجاح!");
        setProfileImageFile(null); // Reset file input
      }
    } catch (err) {
      setProfileMsg(err.message || "فشل في تحديث الملف الشخصي.");
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    setPasswordMsg("");
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }
    if (!currentPassword) {
      setPasswordMsg("Please enter your current password.");
      return;
    }
    setLoading(true);
    try {
      // Re-authenticate
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Now update password
      await updatePassword(currentUser, newPassword);
      setPasswordMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg(err.message || "Failed to update password.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl dark:text-white font-bold mb-6">My Profile</h2>
      <form className="space-y-6" onSubmit={handleProfileSave}>
        {/* Image upload */}
        <div className="flex max-lg:flex-col items-center space-x-4 mb-4">
          <div className="max-lg:mb-4">
            <ProfileImageManager
              profileImage={profileImage}
              onImageChange={handleImageChange}
              onImageDelete={handleImageDelete}
              onAvatarSelect={() => setShowAvatarModal(true)}
              userName={fullName}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-white  mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 dark:bg-[#313340] dark:text-white border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              disabled
              className="w-full p-3 dark:bg-[#313340] dark:text-white border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder=""
              className="w-full p-3 dark:bg-[#313340] dark:text-white border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder=""
              className="w-full p-3 dark:bg-[#313340] dark:text-white border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        {profileMsg && (
          <div className="text-green-600 font-medium">{profileMsg}</div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="max-md:w-full px-6 py-3 bg-primary_app text-white font-semibold rounded-lg hover:bg-primary_app/90 transition-colors"
            disabled={loading}
          >
            Save Changes
          </button>
        </div>
        <div>
          <h3 className="text-lg dark:text-white font-semibold mb-3">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 dark:bg-[#313340] dark:text-white border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 dark:bg-[#313340] dark:text-white border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 dark:bg-[#313340] dark:text-white border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app"
              />
            </div>
            <div className="flex md:block justify-end w-full mt-4 md:mt-0">
              <button
                type="button"
                className="w-full md:w-auto px-6 py-3 bg-primary_app text-white rounded-lg font-semibold hover:bg-primary_app/90 transition-colors"
                onClick={handleChangePassword}
                disabled={loading}
              >
                Change
              </button>
            </div>
          </div>
          {passwordMsg && (
            <div className={`${passwordMsg === "Password updated successfully!" ?  "text-green-600" : "text-red-600"} font-medium mt-2`}>{passwordMsg}</div>
          )}
        </div>
      </form>
      
      {/* Avatar Selection Modal */}
      <AvatarSelectionModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarSelect}
      />
    </div>
  );
};

export default ProfileForm;
