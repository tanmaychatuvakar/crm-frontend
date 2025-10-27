export const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <main className="bg-[#FAFAFA] min-h-screen flex flex-col items-center justify-center p-4">
      {children}
    </main>
  );
};
