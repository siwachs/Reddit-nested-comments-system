const IconButton: React.FC<{
  Icon: any;
  isActive?: boolean;
  color?: string;
  children?: React.ReactNode;
  [key: string]: any;
}> = ({ Icon, isActive = false, color = "", children, ...props }) => {
  return (
    <button
      className={`btn icon-btn ${isActive ? "icon-btn-active" : ""} ${color}`}
      {...props}
    >
      <span className={`${children ? "mr-1" : ""}`}>{Icon}</span>
      {children}
    </button>
  );
};

export default IconButton;
