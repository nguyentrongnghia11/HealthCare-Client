import * as React from "react";

type OtpData = {
  username?: string;
  email?: string;
  password?: string;
  otpCode?: string;
  type?: string
};

type OtpContextType = {
  otpData: OtpData;
  setOtpData: (data: OtpData) => void;
};

// Tạo context
const OtpContext = React.createContext<OtpContextType | undefined>(undefined);

// Provider component
export default function OtpProvider  ({ children }: { children: React.ReactNode }) {
  const [otpData, setOtpData] = React.useState<OtpData>({});
  return (
    <OtpContext.Provider value={{ otpData, setOtpData }}>
      {children}
    </OtpContext.Provider>
  );
};

// Hook tiện lợi để dùng context
export const useOtp = () => {
  const context = React.useContext(OtpContext);
  if (!context) throw new Error("useOtp must be used within OtpProvider");
  return context;
};
