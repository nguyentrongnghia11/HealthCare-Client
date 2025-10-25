import React, { createContext, ReactNode, useContext, useState } from "react";

type OtpData = {
  username?: string;
  email?: string;
  password?: string;
  otpCode?: string;
};

type OtpContextType = {
  otpData: OtpData;
  setOtpData: (data: OtpData) => void;
};

// Tạo context
const OtpContext = createContext<OtpContextType | undefined>(undefined);

// Provider component
export const OtpProvider = ({ children }: { children: ReactNode }) => {
  const [otpData, setOtpData] = useState<OtpData>({});
  return (
    <OtpContext.Provider value={{ otpData, setOtpData }}>
      {children}
    </OtpContext.Provider>
  );
};

// Hook tiện lợi để dùng context
export const useOtp = () => {
  const context = useContext(OtpContext);
  if (!context) throw new Error("useOtp must be used within OtpProvider");
  return context;
};
