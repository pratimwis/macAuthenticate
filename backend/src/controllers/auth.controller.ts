import AppErrorCode from "../constant/appErrorCode";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constant/http";
import User from "../models/user.model";
import appAssert from "../utils/appAssert";
import { catchErrors } from "../utils/catchErrors";
import bcryptjs from "bcryptjs";
import { genarateToken } from "../utils/jwtToken";
import cloudinary from "../lib/cloudinary";
import { getMacAddress } from "../lib/macAddress";

export const signUpController = catchErrors(async (req, res) => {
  const { email, fullName, password } = req.body;
  appAssert(
    email && fullName && password,
    BAD_REQUEST,
    "All field are required",
    AppErrorCode.MissingField
  );
  appAssert(
    password.length >= 6,
    BAD_REQUEST,
    "Password must be at least 6 characters",
    AppErrorCode.InvalidPassword
  );

  const user = await User.findOne({ email });
  appAssert(
    !user,
    BAD_REQUEST,
    "User already exists",
    AppErrorCode.UserAlreadyExists
  );
  const hashedPassword = await bcryptjs.hash(password, 10);
  const userMacAddresse = getMacAddress();

  const newUser = new User({
    email,
    fullName,
    password: hashedPassword,
    macAddresses: userMacAddresse,
  });

  //Genarate jwt token
  genarateToken(newUser._id.toString(), res);
  await newUser.save();
  res
    .status(CREATED)
    .json({ message: "Sign In successful", success: true, user: newUser });
});

export const signInController = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  appAssert(
    email && password,
    BAD_REQUEST,
    "All field are required",
    AppErrorCode.MissingField
  );
  const user = await User.findOne({ email });
  appAssert(user, NOT_FOUND, "User does not exist", AppErrorCode.UserNotFound);
  const isPasswordMatch = await bcryptjs.compare(password, user.password);
  appAssert(
    isPasswordMatch,
    BAD_REQUEST,
    "Password is incorrect",
    AppErrorCode.PasswordMismatch
  );

  const userMacAddresses = getMacAddress() || '';

  const approvedMacs = user.macAddresses || [];

  appAssert(
    approvedMacs.includes(userMacAddresses) && approvedMacs.length <= 3,
    BAD_REQUEST,
    "System not register",
    AppErrorCode.SystemNotRegister
  );

  if (!approvedMacs.includes(userMacAddresses) && approvedMacs.length < 3) {
    approvedMacs.push(userMacAddresses);
    user.macAddresses = approvedMacs;
    await user.save();
  }

  //Genarate jwt token
  genarateToken(user._id.toString(), res);
  res.status(OK).json({ message: "Sign In successful", success: true, user });
});

export const signOutController = catchErrors(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(OK).json({ message: "Sign out successful", success: true });
});

export const systemRegisterRequest = catchErrors(async (req, res) => {
  const { email, macAddress } = req.body;
  appAssert(
    email && macAddress,
    BAD_REQUEST,
    "Mac adress is required",
    AppErrorCode.MissingField
  );
  const user = await User.findOne({ email });
  appAssert(user, BAD_REQUEST, "Not register user", AppErrorCode.UserNotFound);
  const userMacAddresses = user?.macAddresses || [];
  const macRequests = user?.macRequests || [];
  const alreadyRequested = macRequests.some(
    (macRequest) => macRequest.mac === macAddress
  );

  appAssert(
    !alreadyRequested,
    BAD_REQUEST,
    "Already requested",
    AppErrorCode.SomethingWentWrong
  );

  appAssert(
    userMacAddresses?.length >= 3,
    BAD_REQUEST,
    "Something went wrong",
    AppErrorCode.SomethingWentWrong
  );
  //Todo email admin with the macadress and name

  const permisson = true;
  appAssert(
    permisson,
    BAD_REQUEST,
    "Permission not granted by admin",
    AppErrorCode.PermissionNotGranted
  );
  userMacAddresses.push(macAddress);
  user.macAddresses = userMacAddresses;
  user.macRequests.push({ mac: macAddress, status: "approved" });

  await user.save();
  res
    .status(OK)
    .json({ message: "System Register , please login", success: true, user });
});

// export const checkAuth = catchErrors(async (req, res) => {
//   const user = req.user;
//   appAssert(user, NOT_FOUND, "User not found", AppErrorCode.UserNotFound);
//   res
//     .status(OK)
//     .json({ message: "User is authenticated", success: true, user });
// });
