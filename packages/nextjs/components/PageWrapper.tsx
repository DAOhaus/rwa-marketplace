function PageWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center flex-col flex-grow pt-11 p-6 w-full max-w-screen-xl mx-auto ${className}`}>
      {children}
    </div>
  );
}
export default PageWrapper;
