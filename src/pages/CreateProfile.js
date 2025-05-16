import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Stepper, Step } from "react-form-stepper";
import Modal from "react-bootstrap/Modal";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import UploadingAnimation from "../assets/uploading.gif";
import { db } from "../firebase";
import {
  categoriesData,
  subjectsData,
  classesData,
  locationsData,
  citiesData,
} from "../data/Data";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Success Modal Component
function SuccessModal({ show, onHide }) {
  return (
    <Modal show={show} size="sm" centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Typography variant="body2">
          Your tutor profile is created! We’ll contact you soon.
        </Typography>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="contained"
          onClick={onHide}
          size="small"
          sx={{
            minWidth: "80px",
            maxWidth: "120px",
            py: 1,
            borderRadius: "8px",
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// Main CreateProfile Component
const CreateProfile = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const user_id = user?.uid;

  const [loading, setLoading] = useState(true);
  const [loadingImage] = useState(UploadingAnimation);
  const [step, setStep] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [city, setCity] = useState("");
  const [cityPincodes, setCityPincodes] = useState([]);
  const [tutoringStyles, setTutoringStyles] = useState([]);
  const [preferredLocations, setPreferredLocations] = useState([]);
  const [preferredClasses, setPreferredClasses] = useState([]);
  const [preferredSubjects, setPreferredSubjects] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Check if user already has a profile
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user_id) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "tutorProfiles"),
          where("userId", "==", user_id)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          navigate("/profile");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking user profile:", error);
        setLoading(false);
        setError("Failed to load profile check.");
      }
    };
    checkUserProfile();
  }, [user_id, navigate]);

  // Filter pincodes based on selected city
  useEffect(() => {
    if (city) {
      const filtered = locationsData.filter((loc) => loc.cityId === city);
      setCityPincodes(filtered);
    }
  }, [city]);

  // Handlers
  const handleDayToggle = useCallback((day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }, []);

  const handleMultiSelectChange = useCallback(
    (setter) => (event) => {
      setter(event.target.value);
    },
    []
  );

  // Form submission
  const onSubmit = async (data) => {
    try {
      const profileData = {
        basicInfo: {
          firstName: data.basicInfo.firstName,
          lastName: data.basicInfo.lastName,
          gender: data.basicInfo.gender,
          whatsAppNumber: data.basicInfo.whatsAppNumber,
          dateOfBirth: data.basicInfo.dateOfBirth,
        },
        tutoringInfo: {
          preferredCategories,
          preferredClasses,
          preferredSubjects,
          city,
          tutoringMethod: tutoringStyles,
          preferredLocations,
          preferredDays: availableDays,
        },
        otherInfo: {
          tutoringMethod: tutoringStyles,
          fromTime,
          toTime,
          description: data.otherInfo.description,
        },
        personalInformation: {
          additionalNumber: data.personalInformation.additionalNumber,
          overview: data.personalInformation.overview,
        },
        userId: user_id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "tutorProfiles"), profileData);
      console.log("Document written with ID: ", docRef.id);
      setModalShow(true);
      navigate("/profile");
      reset();
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Failed to create profile: " + error.message);
    }
  };

  const buttonStyles = {
    minWidth: { xs: "100px", sm: "120px" },
    maxWidth: { xs: "150px", sm: "180px" },
    py: 1,
    borderRadius: "8px",
    fontSize: { xs: "0.875rem", sm: "1rem" },
  };

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
    <Box sx={{ maxWidth: "100%", margin: "auto", p: { xs: 2, sm: 4 } }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        Create Your Tutor Profile
      </Typography>

      <Box sx={{ overflowX: "auto", mb: 3 }}>
        <Stepper
          activeStep={step}
          styleConfig={{ size: "2em" }}
          sx={{ minWidth: { xs: "600px", sm: "auto" } }}
        >
          <Step label="Basic Info" />
          <Step label="Tutoring Expertise" />
          <Step label="Preferences" />
          <Step label="Availability" />
        </Stepper>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Step 1: Basic Information */}
          {step === 0 && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                >
                  Basic Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  size="small"
                  {...register("basicInfo.firstName", { required: "Required" })}
                  error={!!errors.basicInfo?.firstName}
                  helperText={errors.basicInfo?.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  size="small"
                  {...register("basicInfo.lastName", { required: "Required" })}
                  error={!!errors.basicInfo?.lastName}
                  helperText={errors.basicInfo?.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={!!errors.basicInfo?.gender}
                  size="small"
                >
                  <InputLabel>Gender</InputLabel>
                  <Select
                    {...register("basicInfo.gender", { required: "Required" })}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  <FormHelperText>
                    {errors.basicInfo?.gender?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="WhatsApp Number"
                  type="tel"
                  size="small"
                  {...register("basicInfo.whatsAppNumber", {
                    required: "Required",
                  })}
                  error={!!errors.basicInfo?.whatsAppNumber}
                  helperText={errors.basicInfo?.whatsAppNumber?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  {...register("basicInfo.dateOfBirth", {
                    required: "Required",
                  })}
                  error={!!errors.basicInfo?.dateOfBirth}
                  helperText={errors.basicInfo?.dateOfBirth?.message}
                />
              </Grid>
            </>
          )}

          {/* Step 2: Tutoring Expertise */}
          {step === 1 && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                >
                  Tutoring Expertise
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={preferredCategories}
                    onChange={handleMultiSelectChange(setPreferredCategories)}
                    input={<OutlinedInput label="Categories" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              categoriesData.find((c) => c._id === value)?.name
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {categoriesData.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        <Checkbox
                          checked={preferredCategories.includes(cat._id)}
                        />
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Classes</InputLabel>
                  <Select
                    multiple
                    value={preferredClasses}
                    onChange={handleMultiSelectChange(setPreferredClasses)}
                    input={<OutlinedInput label="Classes" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              classesData.find((c) => c._id === value)?.name
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {classesData.map((cls) => (
                      <MenuItem key={cls._id} value={cls._id}>
                        <Checkbox
                          checked={preferredClasses.includes(cls._id)}
                        />
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Subjects</InputLabel>
                  <Select
                    multiple
                    value={preferredSubjects}
                    onChange={handleMultiSelectChange(setPreferredSubjects)}
                    input={<OutlinedInput label="Subjects" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              subjectsData.find((s) => s._id === value)?.name
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {subjectsData.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        <Checkbox
                          checked={preferredSubjects.includes(sub._id)}
                        />
                        {sub.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {/* Step 3: Preferences */}
          {step === 2 && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                >
                  Tutoring Preferences
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>City</InputLabel>
                  <Select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {citiesData.map((city) => (
                      <MenuItem key={city._id} value={city._id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Preferred Locations</InputLabel>
                  <Select
                    multiple
                    value={preferredLocations}
                    onChange={handleMultiSelectChange(setPreferredLocations)}
                    input={<OutlinedInput label="Preferred Locations" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              locationsData.find((l) => l._id === value)?.name
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {cityPincodes.map((loc) => (
                      <MenuItem key={loc._id} value={loc._id}>
                        <Checkbox
                          checked={preferredLocations.includes(loc._id)}
                        />
                        {loc.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tutoring Methods</InputLabel>
                  <Select
                    multiple
                    value={tutoringStyles}
                    onChange={handleMultiSelectChange(setTutoringStyles)}
                    input={<OutlinedInput label="Tutoring Methods" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="One to One">One to One</MenuItem>
                    <MenuItem value="Online Tutoring">Online Tutoring</MenuItem>
                    <MenuItem value="Group Classes">Group Classes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Method Description"
                  multiline
                  rows={2}
                  size="small"
                  {...register("otherInfo.description", {
                    required: "Required",
                  })}
                  error={!!errors.otherInfo?.description}
                  helperText={errors.otherInfo?.description?.message}
                />
              </Grid>
            </>
          )}

          {/* Step 4: Availability & Additional Info */}
          {step === 3 && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                >
                  Availability & Additional Info
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Available Days
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {daysOfWeek.map((day) => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          checked={availableDays.includes(day)}
                          onChange={() => handleDayToggle(day)}
                        />
                      }
                      label={day}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="From Time"
                  type="time"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="To Time"
                  type="time"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Additional Number"
                  type="tel"
                  size="small"
                  {...register("personalInformation.additionalNumber")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Overview"
                  multiline
                  rows={2}
                  size="small"
                  {...register("personalInformation.overview", {
                    required: "Required",
                  })}
                  error={!!errors.personalInformation?.overview}
                  helperText={errors.personalInformation?.overview?.message}
                />
              </Grid>
            </>
          )}

          {/* Navigation Buttons */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setStep((prev) => prev - 1)}
                disabled={step === 0}
                size="small"
                sx={{
                  ...buttonStyles,
                  borderColor: "grey.500",
                  color: "grey.700",
                  "&:hover": {
                    borderColor: "grey.700",
                    bgcolor: "grey.100",
                  },
                }}
              >
                Back
              </Button>
              {step < 3 ? (
                <Button
                  variant="contained"
                  onClick={() => setStep((prev) => prev + 1)}
                  size="small"
                  sx={buttonStyles}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  size="small"
                  sx={{
                    ...buttonStyles,
                    bgcolor: "success.main",
                    "&:hover": { bgcolor: "success.dark" },
                  }}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>

      <SuccessModal show={modalShow} onHide={() => setModalShow(false)} />
    </Box>
  );
};

export default CreateProfile;