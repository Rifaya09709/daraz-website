
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "seller" | "admin";
  profileImage?: string;

  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;

  addresses: IAddress[];

  comparePassword(password: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: { type: String, required: true, unique: true },

    password: { type: String, required: true, minlength: 6 },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    profileImage: { type: String, default: "" },

    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    addresses: [AddressSchema],
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);


