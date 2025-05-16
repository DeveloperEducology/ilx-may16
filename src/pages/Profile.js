import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import { db } from "../firebase";
import {
  classesData,
  categoriesData,
  subjectsData,
  locationsData,
  citiesData,
} from "../data/Data";
import UploadingAnimation from "../assets/uploading.gif";
import DefaultImage from "../assets/upload-photo-here.png";
import EditIcon from "../assets/edit.svg";

function Profile() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [avatarURL, setAvatarURL] = useState(DefaultImage);
  const [profile, setProfile] = useState(null);
  const [loadingImage] = useState(UploadingAnimation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const tutorProfileCollectionRef = collection(db, "tutorProfiles");
        const queryRef = query(
          tutorProfileCollectionRef,
          where("userId", "==", user.uid)
        );

        const data = await getDocs(queryRef);
        const profiles = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        if (profiles.length > 0) {
          setProfile(profiles[0]);
          setAvatarURL(profiles[0].profilePhoto || DefaultImage);
        } else {
          setProfile(null);
          setAvatarURL(DefaultImage);
        }
        console.log("Fetched profile:", profiles);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.uid]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarURL(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
      uploadImage(selectedFile);
    }
  };

  const uploadImage = async (file) => {
    if (!file) {
      setError("No file selected for upload");
      console.error("No file selected");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setAvatarURL(UploadingAnimation);

    try {
      const response = await fetch(
        "https://cakeserver-7w95x5h7.b4a.run/fileUpload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (!result.data?.url) {
        throw new Error("No URL returned from server");
      }

      const uploadedUrl = result.data.url;
      setAvatarURL(uploadedUrl);
      console.log("Image uploaded successfully. URL:", uploadedUrl);

      if (profile) {
        const profileDocRef = doc(db, "tutorProfiles", profile.id);
        await updateDoc(profileDocRef, {
          profilePhoto: uploadedUrl,
        });
        console.log("Profile updated with new image URL");
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePhoto: uploadedUrl,
        }));
      } else {
        const newProfile = {
          userId: user.uid,
          profilePhoto: uploadedUrl,
          createdAt: new Date().toISOString(),
          basicInfo: {},
          tutoringInfo: {},
          otherInfo: {},
          personalInformation: {},
        };
        const tutorProfileCollectionRef = collection(db, "tutorProfiles");
        const newDocRef = await addDoc(tutorProfileCollectionRef, newProfile);
        setProfile({ ...newProfile, id: newDocRef.id });
        console.log("New profile created with image URL");
      }

      return uploadedUrl;
    } catch (error) {
      console.error("Image upload error:", error.message);
      setError(`Failed to upload image: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMappedTutoringInfo = () => {
    if (!profile?.tutoringInfo) return null;

    const {
      preferredClasses,
      preferredCategories,
      preferredSubjects,
      preferredLocations,
      city,
      tutoringMethod,
      preferredDays,
    } = profile.tutoringInfo;

    const mappedClasses = preferredClasses.map(
      (id) => classesData.find((c) => c._id === id)?.name || "Unknown Class"
    );
    const mappedCategories = preferredCategories.map(
      (id) =>
        categoriesData.find((c) => c._id === id)?.name || "Unknown Category"
    );
    const mappedSubjects = preferredSubjects.map(
      (id) => subjectsData.find((s) => s._id === id)?.name || "Unknown Subject"
    );
    const mappedLocations = preferredLocations.map(
      (id) =>
        locationsData.find((l) => l._id === id)?.name || "Unknown Location"
    );
    const mappedCity =
      citiesData.find((c) => c._id === city)?.name || "Unknown City";

    return {
      mappedClasses,
      mappedCategories,
      mappedSubjects,
      mappedLocations,
      mappedCity,
      tutoringMethod,
      preferredDays,
    };
  };

  const tutoringInfo = getMappedTutoringInfo();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img
          src={loadingImage}
          alt="Loading"
          className="w-24 h-24 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Tutor Profile
      </h1>

      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Profile Photo
        </h2>
        <div className="flex flex-col items-center">
          <div className="relative inline-block">
            <img
              src={avatarURL}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <label
              htmlFor="image-upload"
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 border-2 border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-300"
            >
              <img src={EditIcon} alt="Edit" className="w-6 h-6" />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          {loading && (
            <p className="mt-2 text-sm text-gray-500">Uploading...</p>
          )}
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </section>

      {profile ? (
        <div className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong className="text-gray-600">Name:</strong>{" "}
                {profile.basicInfo.firstName} {profile.basicInfo.lastName}
              </p>
              <p>
                <strong className="text-gray-600">Gender:</strong>{" "}
                {profile.basicInfo.gender || "Not specified"}
              </p>
              <p>
                <strong className="text-gray-600">WhatsApp Number:</strong>{" "}
                {profile.basicInfo.whatsAppNumber || "N/A"}
              </p>
              <p>
                <strong className="text-gray-600">Date of Birth:</strong>{" "}
                {profile.basicInfo.dateOfBirth
                  ? new Date(profile.basicInfo.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong className="text-gray-600">Email:</strong> {user.email}
              </p>
            </div>
          </section>

          {/* Tutoring Preferences */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Tutoring Preferences
            </h2>
            {tutoringInfo ? (
              <div className="space-y-2">
                <p>
                  <strong className="text-gray-600">City:</strong>{" "}
                  {tutoringInfo.mappedCity}
                </p>
                <p>
                  <strong className="text-gray-600">Preferred Classes:</strong>{" "}
                  {tutoringInfo.mappedClasses.join(", ") || "None"}
                </p>
                <p>
                  <strong className="text-gray-600">
                    Preferred Categories:
                  </strong>{" "}
                  {tutoringInfo.mappedCategories.join(", ") || "None"}
                </p>
                <p>
                  <strong className="text-gray-600">Preferred Subjects:</strong>{" "}
                  {tutoringInfo.mappedSubjects.join(", ") || "None"}
                </p>
                <p>
                  <strong className="text-gray-600">
                    Preferred Locations:
                  </strong>{" "}
                  {tutoringInfo.mappedLocations.join(", ") || "None"}
                </p>
                <p>
                  <strong className="text-gray-600">Tutoring Methods:</strong>{" "}
                  {tutoringInfo.tutoringMethod.join(", ") ||
                    profile.otherInfo.tutoringMethod.join(", ") ||
                    "N/A"}
                </p>
                <p>
                  <strong className="text-gray-600">Available Days:</strong>{" "}
                  {tutoringInfo.preferredDays.join(", ") || "N/A"}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">
                No tutoring preferences available.
              </p>
            )}
          </section>

          {/* Personal Overview */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Overview
            </h2>
            <div className="space-y-2">
              <p>
                <strong className="text-gray-600">About Me:</strong>{" "}
                {profile.personalInformation.overview ||
                  profile.otherInfo.description ||
                  "N/A"}
              </p>
            </div>
          </section>

          {/* Additional Contact Info */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Additional Contact & Availability
            </h2>
            <div className="space-y-2">
              <p>
                <strong className="text-gray-600">Additional Number:</strong>{" "}
                {profile.personalInformation.additionalNumber || "N/A"}
              </p>
              <p>
                <strong className="text-gray-600">From Time:</strong>{" "}
                {profile.otherInfo.fromTime || "N/A"}
              </p>
              <p>
                <strong className="text-gray-600">To Time:</strong>{" "}
                {profile.otherInfo.toTime || "N/A"}
              </p>
              <p>
                <strong className="text-gray-600">Created At:</strong>{" "}
                {new Date(profile.createdAt).toLocaleString()}
              </p>
            </div>
          </section>

          <Link
            to="/edit-profile"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Edit Profile
          </Link>
        </div>
      ) : (
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">No profile found.</p>
          <Link
            to="/create"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            Create a Profile
          </Link>
        </div>
      )}
    </div>
  );
}

export default Profile;
