interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, type = "button" }: ButtonProps) {
  return (
    <button
      className="cursor-pointer items-center rounded-full border border-gray-200/50 bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600"
      type={type}
    >
      {children}
    </button>
  );
}
