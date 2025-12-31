import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const styles = {
    default: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    outline: "border border-gray-300 text-gray-700 bg-white",
  };

  return (
    <span
      className={clsx(
        "px-3 py-1 text-xs font-medium rounded-full",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
