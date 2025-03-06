import { motion } from "framer-motion";

export const HoverBorderGradient = ({ children, containerClassName, className, as: Component = "div" }) => {
  return (
    <motion.div
      className={`${containerClassName} relative`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <Component className={`relative z-10 ${className}`}>{children}</Component>
    </motion.div>
  );
};